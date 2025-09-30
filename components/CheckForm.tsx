"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, ShieldCheck, Lock } from "lucide-react";

type State = { ok: boolean; message: string } | null;

export function CheckForm({
  serverAction,
  gateOpen,
}: {
  serverAction: (formData: FormData) => Promise<State>;
  gateOpen: boolean;
}) {
  const action = async (_prev: State, formData: FormData): Promise<State> => {
    const res = await serverAction(formData);
    return res ?? null;
  };

  const [state, formAction, pending] = useActionState<State, FormData>(action, null);

  return (
    <>
      <Dialog open={!gateOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md bg-white/10 backdrop-blur-md border border-white/30 text-white">
          <DialogHeader>
            <DialogTitle className="inline-flex items-center gap-2">
              <Lock className="size-5" /> Cek Kelulusan Belum Dibuka
            </DialogTitle>
            <DialogDescription className="text-white/90">
              Fitur cek kelulusan belum tersedia saat ini. Silakan kembali lagi sesuai jadwal yang ditentukan.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <form action={formAction} className="space-y-5 sm:space-y-6">
        <div className="space-y-2">
          <Label htmlFor="nis" className="text-sm sm:text-[0.95rem] text-white/95">
            Nomor Peserta
          </Label>
          <div className="relative">
            <Input
              id="nis"
              name="nis"
              inputMode="numeric"
              placeholder="Masukan nomor peserta di sini"
              required
              aria-describedby="nis-help"
              disabled={!gateOpen || pending}
              className="
                pr-10
                text-white
                placeholder:text-white/90 focus:placeholder:text-white
                bg-white/10 border-white/20
                focus-visible:ring-white/50 focus-visible:border-white/60
                backdrop-blur-sm
              "
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-white/70">
              <ShieldCheck className="size-4" aria-hidden="true" />
            </span>
          </div>
          <p id="nis-help" className="text-xs text-white/80">
            Nomor peserta harus terdiri dari 10 digit angka.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tanggal" className="text-sm sm:text-[0.95rem] text-white/95">
            Tanggal Lahir
          </Label>
          <Input
            id="tanggal"
            name="tanggal"
            type="date"
            required
            aria-describedby="dob-help"
            disabled={!gateOpen || pending}
            className="
              bg-white/10 border-white/20 text-white
              [color-scheme:dark]
              focus-visible:ring-white/50 focus-visible:border-white/60
              backdrop-blur-sm
            "
          />
          <p id="dob-help" className="text-xs text-white/80">
            Format <span className="tabular-nums">YYYY‑MM‑DD</span>.
          </p>
        </div>

        {state?.ok === false && (
          <Alert
            variant="destructive"
            role="alert"
            className="bg-red-500/15 text-red-100 border-red-200/30 backdrop-blur-sm"
          >
            <AlertDescription className="text-sm">{state.message}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          disabled={!gateOpen || pending}
          aria-busy={pending}
          className="
            w-full h-11
            bg-white/20 hover:bg-white/30 text-white
            border border-white/30
            backdrop-blur-sm
          "
        >
          {pending ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Memproses…
            </span>
          ) : (
            "CEK"
          )}
        </Button>

        <p className="text-[11px] leading-5 text-white/80 text-center">
          Dibuat untuk verifikasi; data tidak disimpan di perangkat Anda.
        </p>
      </form>
    </>
  );
}
