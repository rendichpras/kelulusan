"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
export function SignOutButton({ name }: { name?: string }) {
  return <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>Keluar {name ? `(${name})` : ""}</Button>;
}