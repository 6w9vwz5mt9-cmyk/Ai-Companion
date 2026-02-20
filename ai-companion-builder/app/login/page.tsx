"use client";

import { Suspense } from "react";

function LoginContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <p>This is the login page.</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
