import { LoginCard } from "@/components/login";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-24">
      <LoginCard />

      <br />

      <h3 className="mt-8 text-2xl font-bold">Instruções</h3>
      <p className="mt-4 text-center">
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
