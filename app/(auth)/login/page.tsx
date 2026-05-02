"use client";
import { SyntheticEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });

    if (result?.error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
          Bon retour
        </h2>
        <p className="text-zinc-500 text-sm">Connectez-vous à votre compte</p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Erreur */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

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
            className="h-12 border-zinc-200 focus:border-zinc-900 rounded-lg"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-zinc-900 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-zinc-500">
        Pas encore de compte ?{" "}
        <Link
          href="/register"
          className="text-zinc-900 font-medium underline underline-offset-4 hover:text-zinc-600"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
