"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const LoginCard: React.FC = () => {
  const [name, setName] = useState("");

  const router = useRouter();
  function handleLogin() {
    if (!name) return;
    localStorage.setItem("galaxies@name", name);
    router.push("/game/1");
  }

  useEffect(() => {
    const name = localStorage.getItem("galaxies@name");

    if (name) {
      setName(name);
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 w-80 mx-auto my-8">
      <label htmlFor="name" className="w-full text-rose-600">
        Seu nome
      </label>
      <input
        type="text"
        name="name"
        id="name"
        className="border border-rose-600 rounded-md p-2 text-black"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        className="bg-rose-600 text-white font-bold rounded-md p-2 hover:bg-rose-400 transition-colors"
        onClick={handleLogin}
      >
        Start
      </button>
    </div>
  );
};
