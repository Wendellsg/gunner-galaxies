"use client";
import { GamePainel } from "@/components/painel";
import { colors } from "@/constants/colors";
import { Game, Particle, Player } from "@/utils/entities";
import { useEffect, useRef, useState } from "react";

export type Score = {
  name: string;
  score: number;
  id: string;
  particles: number;
  boost: boolean;
  color: string;
};

const user = {
  id: "1",
  name: "Wendell",
  score: 0,
  particles: 0,
  boost: false,
  color: "white",
};
const game = new Game();

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameScore, setGameScore] = useState<Score[]>([]);

  function startGame() {
    if (!canvasRef.current) return;

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

    if (!user.name) return;

    const player = new Player(
      user.id,
      user.name,
      0,
      Math.random() * 1280,
      Math.random() * 720,
      colors[Math.floor(Math.random() * colors.length)]
    );

    if (!game.players.find((player) => player.id === user.id)) {
      game.addPlayer(player);
    }

    particles.forEach((particle) => game.addParticle(particle));
    game.start(canvasRef.current, setGameScore);

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

  useEffect(() => {
    startGame();
  }, []);

  return (
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
  );
}
