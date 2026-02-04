import { useState } from "react";
import type { Route } from "./+types/login";
import { authClient } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card } from "~/components/ui/card";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Sign in" }];
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!trimmed) return;

    const { error } = await authClient.signIn.magicLink({
      email: trimmed,
      callbackURL: "/",
    });

    if (error) {
      setError(String(error));
      return;
    }

    setSent(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-6 bg-white dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Sign in
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          We’ll email you a magic link.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            type="email"
            autoComplete="email"
            required
          />

          <Button type="submit" className="w-full" disabled={sent}>
            {sent ? "Link sent" : "Send sign-in link"}
          </Button>

          {sent && (
            <p className="text-sm text-green-700 dark:text-green-400">
              Check your email for the sign-in link.
            </p>
          )}

          {error && (
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          )}
        </form>
      </Card>
    </main>
  );
}
