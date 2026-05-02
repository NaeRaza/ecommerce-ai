"use client";

import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    router.push("/login?registered=true");
    setLoading(false);
  };
  return (
    <div className="w-full max-w-md space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
          Créer un compte
        </h2>
        <p className="text-zinc-500 text-sm">
          Rejoignez-nous en quelques secondes
        </p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Erreur */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-zinc-700 font-medium">
            Nom
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="name"
            name="name"
            type="text"
            placeholder="Jean Dupont"
            className="h-12 border-zinc-200 focus:border-zinc-900 rounded-lg"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-zinc-700 font-medium">
            Email
          </Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            name="email"
            type="email"
            placeholder="vous@example.com"
            required
            className="h-12 border-zinc-200 focus:border-zinc-900 rounded-lg"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-zinc-700 font-medium">
            Mot de passe
          </Label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            minLength={8}
            className="h-12 border-zinc-200 focus:border-zinc-900 rounded-lg"
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-zinc-900 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
        >
          {loading ? "Création..." : "Créer mon compte"}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-zinc-500">
        Déjà un compte ?{" "}
        <Link
          href="/login"
          className="text-zinc-900 font-medium underline underline-offset-4 hover:text-zinc-600"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
