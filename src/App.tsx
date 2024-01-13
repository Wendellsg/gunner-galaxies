import { useRef, useState } from "react";
import "./App.css";
import { Logo } from "./components/logo";
import { GamePainel } from "./components/painel";
import { colors } from "./constants/colors";
import { Game, Particle, Player } from "./utils/entities";

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
      <Logo />
      <div>
        {!gameStarted && (
          <>
            <div className="flex flex-col gap-4 w-80 mx-auto my-8">
              <label htmlFor="name" className="w-full text-rose-600">
                Seu nome
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="border border-rose-600 rounded-md p-2"
              />

              <button
                className="bg-rose-600 text-white font-bold"
                onClick={startGame}
              >
                Start
              </button>
            </div>

            <br />

            <h3 className="mt-16 text-2xl font-bold">Instruções</h3>
            <p>
              Use <strong className="text-rose-600">WASD</strong> para se mover
              e <strong className="text-rose-600">Shift para correr</strong>
              <br />
              Use o <strong className="text-rose-600">mouse</strong> para mirar
              e <strong className="text-rose-600">clique para atirar</strong>
              <br />
              <strong className="text-rose-600">Evite as partículas</strong> e
              tente matar o máximo de jogadores que conseguir
              <br />
              <span>
                Dica: Apenas o núcleo da galáxia pode ser atingido, tente
                acertar.
              </span>
            </p>
          </>
        )}
      </div>

      <div
        className="game-container mt-16"
        style={{
          display: gameStarted ? "flex" : "none",
        }}
      >
        <canvas
          className="mx-auto rounded-md overflow-auto cursor-none  border-rose-600 border-4 bg-transparent shadow-lg outline-offset-1 outline-4 outline-white"
          ref={canvasRef}
          width={1280}
          height={720}
          style={{
            display: gameStarted ? "block" : "none",
          }}
        ></canvas>

        {
          // Mostrar o painel apenas quando o jogo começar
          gameScore && <GamePainel score={gameScore} />
        }

        {gameStarted && (
          <style>
            {`
                body {
                  overflow: hidden;
                  cursor: none;
                }
              `}
          </style>
        )}
      </div>
    </main>
  );
}

export default App;
