import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckForm } from "@/components/CheckForm";
import { checkGraduationAction } from "./actions";
import { db } from "@/lib/db/drizzle";
import { settings } from "@/lib/db/schema";

export default async function Home() {
  const [cfg] = await db.select().from(settings).limit(1);
  const gateOpen =
    !!cfg?.isCheckOpen ||
    (cfg?.openAt ? new Date(cfg.openAt) <= new Date() : false);

  return (
    <main
      className="
        relative min-h-dvh grid place-items-center
        p-4 sm:p-6 md:p-8
        bg-[url('/img/bg.webp')] bg-cover bg-center
      "
    >
      <div className="fixed inset-0 z-10 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <Card
        className="
          relative z-20 w-full
          max-w-sm sm:max-w-md md:max-w-lg
          bg-white/20 backdrop-blur-md border border-white/30 shadow-lg
        "
      >
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-lg sm:text-xl md:text-2xl tracking-tight text-white">
            Cek Kelulusan
          </CardTitle>
          <p className="text-xs sm:text-sm text-white/90">
            Masukkan NIS dan tanggal lahir untuk melihat hasil.
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <CheckForm serverAction={checkGraduationAction} gateOpen={gateOpen} />
        </CardContent>
      </Card>
    </main>
  );
}
