import { db } from "@/lib/db/drizzle";
import { students } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { decodeId } from "@/lib/utils/token";
import { CheckCircle2, XCircle } from "lucide-react";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ sid?: string }>;
}) {
  const { sid: sidRaw } = await searchParams;
  const sid = sidRaw ? decodeId(sidRaw) : null;
  if (!sid) return <p className="min-h-dvh grid place-items-center p-4">Data tidak ditemukan.</p>;

  const [s] = await db.select().from(students).where(eq(students.id, sid)).limit(1);
  if (!s) return <p className="min-h-dvh grid place-items-center p-4">Data tidak ditemukan.</p>;

  const lulus = Boolean(s.statusLulus);

  return (
    <main
      className="
       relative min-h-dvh grid place-items-center p-4
        bg-[url('/img/bg.webp')] bg-cover bg-center
      "
    >
      <div className="fixed inset-0 z-10 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <Card className="relative z-20 w-full max-w-xl bg-white/15 backdrop-blur-md border border-white/30 shadow-lg text-white">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
            {lulus ? (
              <span className="inline-flex items-center gap-2 text-emerald-300">
                SELAMAT! ANDA LULUS
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-rose-300">
                MAAF, ANDA BELUM LULUS
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="rounded-lg border border-white/20 bg-white/10 p-4">
            <dl className="grid grid-cols-3 gap-x-3 gap-y-2">
              <dt className="col-span-1 text-sm text-white/80">NIS</dt>
              <dd className="col-span-2 text-sm font-medium tabular-nums">{s.nis}</dd>

              <dt className="col-span-1 text-sm text-white/80">Nama</dt>
              <dd className="col-span-2 text-sm font-medium">{s.nama}</dd>

              <dt className="col-span-1 text-sm text-white/80">Kelas</dt>
              <dd className="col-span-2 text-sm font-medium">{s.kelas}</dd>
            </dl>
          </div>

          <p className="text-[11px] text-white/80 text-center">
            Simpan tangkapan layar halaman ini untuk arsip.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
