'use client'

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      setWrongPassword(true);
      setSubmitting(false);
      return;
    }

    // Only follow same-site admin paths so the login page can't be used as an
    // open redirect.
    const next = searchParams.get("next");
    router.push(next?.startsWith("/admin") ? next : "/admin/submissions");
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-[#E7F0FF]">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-[20px] bg-white border-2 border-[#222D65] rounded-[20px] p-[40px] w-[420px]">
        <h1 className="font-bold text-[28px] text-[#222D65]">Admin Login</h1>
        <Input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter the admin password."
          className="border-2 border-[#222D65] text-[#222D65] px-4 rounded-[15px] h-14 text-lg"
        />
        {wrongPassword && (
          <Alert className="rounded-md border-l-6 border-red-600 bg-red-600/10 text-red-600 dark:border-red-400 dark:bg-red-400/10 dark:text-red-400">
            <AlertTitle className="text-center">Incorrect password.</AlertTitle>
          </Alert>
        )}
        <Button
          type="submit"
          disabled={submitting || !password}
          style={{ backgroundColor: "#E7F0FF", height: "50px", width: "120px", border: "2px solid #222D65", color: "#222D65" }}
        >Log In</Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
