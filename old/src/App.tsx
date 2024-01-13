import { useRef, useState } from "react";
import { colors } from "../../src/constants/colors";
import { Game, Particle, Player } from "../../src/utils/entities";
import "./App.css";

export type Score = {
  name: string;
  score: number;
  id: string;
  particles: number;
  boost: boolean;
  color: string;
};

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameScore, setGameScore] = useState<Score[]>([]);

  function startGame() {
    if (!canvasRef.current) return;

    const game = new Game(setGameScore);

    const particles = new Array(100).fill(0).map(() => {
      return new Particle(
        Math.random() * 1280,
        Math.random() * 720,
        "white",
        3,
        {
          x: 0,
          y: 0,
        }
      );
    });

    const playerName = (document.getElementById("name") as HTMLInputElement)
      .value;

    const player = new Player(
      (Math.random() * 1000).toString(),
      playerName,
      0,
      Math.random() * 1280,
      Math.random() * 720,
      colors[Math.floor(Math.random() * colors.length)]
    );

    game.addPlayer(player);
    particles.forEach((particle) => game.addParticle(particle));
    game.start(canvasRef.current);

    // Remover event listeners antigos
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Shift") player.activeBoost();
      player.move(e.key);
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      player.stop(e.key);
    };

    const handleClick = () => {
      player.shoot(game);
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      player.updateTarget(e.clientX, e.clientY, game);
    };

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
    window.addEventListener("click", handleClick);
    window.addEventListener("mousemove", mouseMoveHandler);
    setGameStarted(true);

    // Limpar event listeners antigos
    return () => {
      game.stop();
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
      setGameStarted(false);
    };
  }

  return (
    <main className="w-full">
      <div>{!gameStarted && <></>}</div>
    </main>
  );
}

export default App;
