"use client";
import { Score } from "@/app/game/[id]/page";
import { useState } from "react";
export type GamePainelProps = {
  score: Score[];
};

export const GamePainel: React.FC<GamePainelProps> = ({ score }) => {
  const [confirmRestart, setConfirmRestart] = useState(false);

  function handleRestart() {
    window.location.reload();
  }

  return (
    <div className="cursor-default flex flex-col rounded-md border-rose-600 border-4 p-4 min-w-80 shadow-lg bg-black outline-offset-1 outline-4 outline-white">
      <table className="w-full select-none">
        <thead>
          <tr className="text-left">
            <th>Jogador</th>
            <th>Mortes</th>
            <th>Estrelas</th>
          </tr>
        </thead>
        <tbody>
          {score.map((score) => (
            <tr key={score.id} className="text-white font-bold mx-2">
              <td
                style={{
                  color: score.color,
                }}
              >
                {score.name}
              </td>
              <td>{score.score}</td>
              <td>{score.particles}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmRestart ? (
        <div className="flex flex-col mt-auto w-full justify-center">
          <p className="text-white font-bold mb-4">
            Tem certeza que deseja reiniciar?
          </p>

          <div className="w-full flex gap-1 justify-center">
            <button
              className="bg-slate-600 text-white font-bold w-full rounded-md p-2"
              onClick={handleRestart}
            >
              Confirmar
            </button>
            <button
              className="bg-rose-600 text-white font-bold mr-4 w-full rounded-md p-2"
              onClick={() => setConfirmRestart(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          className="bg-rose-600 text-white font-bold mt-auto rounded-md p-2"
          onClick={() => setConfirmRestart(true)}
        >
          Reiniciar
        </button>
      )}
    </div>
  );
};
