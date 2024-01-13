import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
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

        <button className="bg-rose-600 text-white font-bold">
          <Link href="/game/1">Start</Link>
        </button>
      </div>

      <br />

      <h3 className="mt-16 text-2xl font-bold">Instruções</h3>
      <p>
        Use <strong className="text-rose-600">WASD</strong> para se mover e{" "}
        <strong className="text-rose-600">Shift para correr</strong>
        <br />
        Use o <strong className="text-rose-600">mouse</strong> para mirar e{" "}
        <strong className="text-rose-600">clique para atirar</strong>
        <br />
        <strong className="text-rose-600">Evite as partículas</strong> e tente
        matar o máximo de jogadores que conseguir
        <br />
        <span>
          Dica: Apenas o núcleo da galáxia pode ser atingido, tente acertar.
        </span>
      </p>
    </main>
  );
}
