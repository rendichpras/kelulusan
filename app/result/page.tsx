import { db } from "@/lib/db/drizzle";
import { students } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decodeId } from "@/lib/utils/token";

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

      <div className="relative z-20 w-full max-w-3xl space-y-4">
        <div className={`
          w-full p-6 rounded-lg shadow-lg text-white
          ${lulus ? 'bg-green-600' : 'bg-red-600'}
        `}>
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold">
                {lulus ? (
                  "SELAMAT KAMU DINYATAKAN LULUS SELEKSI OSIS SMK HS AGUNG 2025"
                ) : (
                  "MAAF, KAMU DINYATAKAN TIDAK LULUS SELEKSI OSIS SMK HS AGUNG 2025"
                )}
              </h1>
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-black/40 backdrop-blur-sm p-6 rounded-lg text-white">
          <div>
            <div className="mb-4">
              <span className="text-blue-300">Nomor Peserta: </span>
              <span className="font-semibold">{s.nis}</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold">{s.nama}</h2>

              <div>
                <span className="text-white/80">Kelas: </span>
                <span className="font-semibold">{s.kelas}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-sm text-white/80 italic">
            {lulus
              ? "Selamat! Semoga sukses untuk langkah selanjutnya."
              : "Tetap semangat dan jangan menyerah!"
            }
          </div>
        </div>
        <div className="relative z-20 text-center">
          <p className="text-xs text-white/70">
            Dibuat dengan ❤️ oleh{" "}
            <a
              href="https://instagram.com/rendiichtiar"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/90 transition-colors"
            >
              @rendiichtiar
            </a>{" "}
            | © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </main>
  );
}
