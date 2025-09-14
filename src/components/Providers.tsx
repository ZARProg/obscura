"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Jika mau, kamu bisa menambahkan props session di sini:
  // <SessionProvider session={session}>{children}</SessionProvider>
  return <SessionProvider>{children}</SessionProvider>;
}
