import { auth } from "@/lib/auth";
import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    return (
        <div className="min-h-dvh">
            <header className="border-b">
                <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
                    <nav className="flex items-center gap-4 text-sm">
                        <Link href="/admin">Dashboard</Link>
                        <Link href="/admin/students">Peserta</Link>
                        <Link href="/admin/upload">Upload</Link>
                        <Link href="/admin/settings">Settings</Link>
                    </nav>
                    {session?.user ? <SignOutButton name={session.user.name ?? ""} /> : null}
                </div>
            </header>
            <main className="max-w-5xl mx-auto p-4">{children}</main>
        </div>
    );
}
