import { faker } from "@faker-js/faker";
import { Score } from "../../old/src/App";
import { colors } from "../constants/colors";

export enum ParticleType {
  "NORMAL",
  "BULLET",
}
export class Particle {
  x: number;
  y: number;
  color: string;
  damage: number;
  type: ParticleType = ParticleType.NORMAL;
  source: Player | null = null;
  velocity: {
    x: number;
    y: number;
  };
  constructor(
    x: number,
    y: number,
    color: string,
    damage: number,
    velocity: { x: number; y: number }
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.damage = damage;
    this.velocity = velocity;
    this.type = ParticleType.NORMAL;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  orbit(player: Player, index: number) {
    const baseOrbitRadius = 8; // Raio base da órbita
    const orbitSpeed = 0.02; // Velocidade de órbita
    let particlesPerLayer = 10; // Número de partículas por camada, inicializado com 1

    // Calcular a camada atual
    let layer = 0;
    while (index >= particlesPerLayer) {
      index -= particlesPerLayer;
      particlesPerLayer *= 2; // Dobrar o número de partículas a cada camada
      layer++;
    }

    // Calcular o raio da órbita com base na camada
    const orbitRadius = baseOrbitRadius * (layer + 1); // Adicionando 1 para evitar raio zero

    // Calcular a posição na órbita
    const angle =
      (index % particlesPerLayer) * (Math.PI / (particlesPerLayer / 2));
    const x = player.x + orbitRadius * Math.cos(angle);
    const y = player.y + orbitRadius * Math.sin(angle);

    // Atualizar as coordenadas da partícula
    this.x = x;
    this.y = y;
    // Atualizar o índice para a próxima iteração
    index += orbitSpeed;
  }
}

export class Player {
  id: string;
  name: string;
  score: number;
  particles: Particle[];
  x: number;
  y: number;
  color: string;
  velocity: {
    x: number;
    y: number;
  };
  speed: number;
  target: {
    x: number;
    y: number;
  } = {
    x: 0,
    y: 0,
  };
  lastBoost: number = 0;
  boostCooldown: number = 15000;
  boostDuration: number = 5000;
  lastShoot: number = Date.now();
  shootCooldown: number = 300;

  constructor(
    id: string,
    name: string,
    score: number,
    x: number,
    y: number,
    color: string
  ) {
    this.id = id;
    this.name = name;
    this.score = score;
    this.particles = [];
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.speed = 2;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  updateTarget(mouseX: number, mouseY: number, game: Game) {
    const canvasRect = game.canvas!.getBoundingClientRect();

    // Ajustar as coordenadas do mouse para serem relativas ao canvas
    const canvasMouseX = mouseX - canvasRect.left;
    const canvasMouseY = mouseY - canvasRect.top;

    const ctx = game.canvas!.getContext("2d");

    if (!ctx) return;

    // Limpar a posição anterior do alvo
    ctx.clearRect(this.target.x - 6, this.target.y - 6, 18, 18);

    // Definir as novas coordenadas do alvo com base nas coordenadas do mouse no canvas
    this.target.x = canvasMouseX;
    this.target.y = canvasMouseY;

    // Desenhar o novo alvo
    ctx.beginPath();
    ctx.arc(this.target.x, this.target.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  update(ctx: CanvasRenderingContext2D) {
    //Avoid player to go out of the canvas

    if (this.x > ctx.canvas.width) {
      this.x = ctx.canvas.width;
    }

    if (this.x < 0) {
      this.x = 0;
    }

    if (this.y > ctx.canvas.height) {
      this.y = ctx.canvas.height;
    }

    if (this.y < 0) {
      this.y = 0;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  activeBoost() {
    if (Date.now() - this.lastBoost < this.boostCooldown) return;
    this.speed = 5;
    this.lastBoost = Date.now();

    setTimeout(() => {
      this.speed = 2;
    }, this.boostDuration);
  }

  move(key: KeyboardEvent["key"]) {
    switch (key) {
      case "ArrowUp":
        this.velocity.y = this.speed * -1;
        break;
      case "w":
        this.velocity.y = this.speed * -1;
        break;
      case "ArrowDown":
        this.velocity.y = this.speed;
        break;
      case "s":
        this.velocity.y = this.speed;
        break;
      case "ArrowLeft":
        this.velocity.x = this.speed * -1;
        break;
      case "a":
        this.velocity.x = this.speed * -1;
        break;
      case "ArrowRight":
        this.velocity.x = this.speed;
        break;
      case "d":
        this.velocity.x = this.speed;
        break;
    }
  }

  stop(key: KeyboardEvent["key"]) {
    switch (key) {
      case "ArrowUp":
        this.velocity.y = 0;
        break;
      case "w":
        this.velocity.y = 0;
        break;
      case "ArrowDown":
        this.velocity.y = 0;
        break;
      case "s":
        this.velocity.y = 0;
        break;
      case "ArrowLeft":
        this.velocity.x = 0;
        break;
      case "a":
        this.velocity.x = 0;
        break;
      case "ArrowRight":
        this.velocity.x = 0;
        break;
      case "d":
        this.velocity.x = 0;
        break;
    }
  }

  shoot(game: Game) {
    if (!this.target || !this.particles.length) return;

    if (Date.now() - this.lastShoot < this.shootCooldown) return;

    this.lastShoot = Date.now();

    const bullet = this.particles[this.particles.length - 1];

    if (!bullet) return;
    bullet.type = ParticleType.BULLET;
    bullet.source = this;
    this.particles.pop();
    if (!bullet) return;

    const ctx = game.canvas!.getContext("2d");

    if (!ctx) return;

    const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);

    bullet.velocity.x = Math.cos(angle) * 5;
    bullet.velocity.y = Math.sin(angle) * 5;

    if (bullet.x > ctx.canvas.width) {
      game.particles.filter((p) => p !== bullet);
    }

    if (bullet.x < 0) {
      game.particles.filter((p) => p !== bullet);
    }

    if (bullet.y > ctx.canvas.height) {
      game.particles.filter((p) => p !== bullet);
    }

    if (bullet.y < 0) {
      game.particles.filter((p) => p !== bullet);
    }

    bullet.update();
  }

  addParticle(particle: Particle) {
    particle.source = this;
    particle.color = this.color + "80";
    if (this.particles.includes(particle)) return;
    this.particles.push(particle);
  }
}

export class Enemy extends Player {
  constructor(
    id: string,
    name: string,
    score: number = 0,
    x: number,
    y: number,
    color: string
  ) {
    super(id, name, score, x, y, color);
  }

  hunt(game: Game) {
    const particles = game.particles.filter(
      (p) => p.type === ParticleType.NORMAL && !p.source
    );

    if (!particles.length) {
      // Se não houver partículas, o inimigo pode realizar alguma ação alternativa ou apenas retornar.
      this.speed = 0.5;
      this.velocity.x = Math.random() * 2 - 1;
      this.velocity.y = Math.random() * 2 - 1;
    } else {
      // Ordenar as partículas com base na distância do inimigo
      particles.sort((a, b) => {
        const distanceA = Math.hypot(this.x - a.x, this.y - a.y);
        const distanceB = Math.hypot(this.x - b.x, this.y - b.y);
        return distanceA - distanceB;
      });

      const closestParticle = particles[0]; // Pegar a partícula mais próxima

      const angle = Math.atan2(
        closestParticle.y - this.y,
        closestParticle.x - this.x
      );

      this.speed = 0.5;
      this.velocity.x = Math.cos(angle) * this.speed;
      this.velocity.y = Math.sin(angle) * this.speed;
    }

    game.players.forEach((player) => {
      if (player === this) return;

      const distance = Math.hypot(this.x - player.x, this.y - player.y);

      if (distance < 100) {
        this.target.x = player.x;
        this.target.y = player.y;
        this.shoot(game);
      }
    });
  }
}

export class Game {
  players: Player[] = [];
  enemies: Enemy[] = [];
  particles: Particle[] = [];
  canvas: HTMLCanvasElement | null = null;
  constructor() {}

  addPlayer(player: Player) {
    this.players.push(player);
  }

  addParticle(particle: Particle) {
    this.particles.push(particle);
  }

  removePlayer(player: Player) {
    this.players = this.players.filter((p) => p.id !== player.id);
  }

  removeParticle(particle: Particle) {
    this.particles = this.particles.filter((p) => p !== particle);
  }

  start(
    canvas: HTMLCanvasElement,
    setGameScore: React.Dispatch<React.SetStateAction<Score[]>>
  ) {
    this.canvas = canvas;
    const ctx = this.canvas.getContext("2d");

    if (!ctx) return;

    ctx.fillStyle = "black";

    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.spawnParticles();
    this.spawnEnemies();

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";

      ctx.fillRect(0, 0, this.canvas!.width, this.canvas!.height);

      this.players.forEach((player) => {
        player.update(ctx);
        player.particles.forEach((particle, index) => {
          particle.orbit(player, index);
        });
        player.draw(ctx);
        if (player instanceof Enemy) {
          player.hunt(this);
        }
      });

      this.particles.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });

      this.checkCollision(setGameScore);
      setGameScore((prevState) => {
        const newState = [...prevState];

        newState.forEach((s) => {
          const index = this.players.findIndex((p) => p.id === s.id);
          if (index === -1) {
            newState.splice(index, 1);
          }
        });

        this.players.forEach((player) => {
          const index = newState.findIndex((s) => s.id === player.id);

          const boostState = player.speed === 5 ? true : false;

          if (index === -1) {
            newState.push({
              id: player.id,
              color: player.color,
              name: player.name,
              score: player.score,
              boost: boostState,
              particles: player.particles.length,
            });
          } else {
            newState[index].score = player.score;
            newState[index].boost = boostState;
            newState[index].particles = player.particles.length;
          }
        });
        return newState;
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  stop() {
    const ctx = this.canvas!.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, this.canvas!.width, this.canvas!.height);
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", this.canvas!.width / 2, this.canvas!.height / 2);
  }

  spawnParticles() {
    setInterval(() => {
      const x = Math.random() * this.canvas!.width;
      const y = Math.random() * this.canvas!.height;
      const color = "white";
      const damage = 1;
      const velocity = {
        x: 0,
        y: 0,
      };
      this.addParticle(new Particle(x, y, color, damage, velocity));
    }, 250);
  }

  spawnEnemies() {
    setInterval(() => {
      if (this.players.length > 5) return;
      const randomName = faker.person.firstName(); // Rowan Nikolaus
      const x = Math.random() * this.canvas!.width;
      const y = Math.random() * this.canvas!.height;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const newEnemy = new Enemy(
        (Math.random() * 5000).toString(),
        randomName,
        0,
        x,
        y,
        color
      );
      this.addPlayer(newEnemy);
    }, 5000);
  }

  checkCollision(setGameScore: React.Dispatch<React.SetStateAction<Score[]>>) {
    this.players.forEach((player) => {
      this.particles.forEach((particle) => {
        if (player.particles.includes(particle) || player === particle.source)
          return;

        const distance = Math.hypot(
          player.x - particle.x,
          player.y - particle.y
        );

        if (distance - 5 - 2 < 1) {
          if (particle.type === ParticleType.BULLET) {
            if (player.particles.length < 3) {
              this.removePlayer(player);
              setGameScore((prevState) => {
                const newState = [...prevState];
                const index = newState.findIndex((s) => s.id === player.id);
                newState.splice(index, 1);
                return newState;
              });
              particle.source!.score++;
              player.particles.forEach((p) => {
                p.source = null;
                p.type = ParticleType.NORMAL;
              });
              return;
            }

            const lastParticles = player.particles.splice(
              player.particles.length - 3,
              3
            );

            lastParticles.forEach((p) => {
              p.source = null;
              p.type = ParticleType.NORMAL;
              this.removeParticle(p);
            });
          } else {
            if (particle.source) return;
            player.addParticle(particle);
          }
        }

        player.particles.forEach((playerParticle) => {
          const distance = Math.hypot(
            playerParticle.x - particle.x,
            playerParticle.y - particle.y
          );

          if (distance - 2 - 2 < 1) {
            if (particle.type !== ParticleType.BULLET) {
              if (particle.source) return;
              player.addParticle(particle);
            }
          }
        });
      });
    });
  }
}
