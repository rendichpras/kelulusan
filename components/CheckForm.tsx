"use client";

import { useActionState } from "react";
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
      {!gateOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 grid place-items-center p-4">
          <div className="sm:max-w-md bg-white/10 backdrop-blur-md border border-white/30 text-white p-6 rounded-lg">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold inline-flex items-center gap-2">
                <Lock className="size-5" /> Cek Kelulusan Belum Dibuka
              </h2>
              <p className="text-white/90">
                Fitur cek kelulusan belum tersedia saat ini. Silakan kembali lagi sesuai jadwal yang ditentukan.
              </p>
            </div>
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-5 sm:space-y-6">
        <div className="space-y-2">
          <label htmlFor="nis" className="block text-sm sm:text-[0.95rem] text-white/95">
            Nomor Peserta
          </label>
          <div className="relative">
            <input
              id="nis"
              name="nis"
              inputMode="numeric"
              placeholder="Masukan nomor peserta di sini"
              required
              aria-describedby="nis-help"
              disabled={!gateOpen || pending}
              className="
                w-full px-3 h-10 rounded-md
                pr-10
                text-white
                placeholder:text-white/90 focus:placeholder:text-white
                bg-white/10 border border-white/20
                focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60
                backdrop-blur-sm
                disabled:opacity-50 disabled:cursor-not-allowed
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
          <label htmlFor="tanggal" className="block text-sm sm:text-[0.95rem] text-white/95">
            Tanggal Lahir
          </label>
          <input
            id="tanggal"
            name="tanggal"
            type="date"
            required
            aria-describedby="dob-help"
            disabled={!gateOpen || pending}
            className="
              w-full px-3 h-10 rounded-md
              bg-white/10 border border-white/20 text-white
              [color-scheme:dark]
              focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60
              backdrop-blur-sm
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          />
          <p id="dob-help" className="text-xs text-white/80">
            Format <span className="tabular-nums">YYYY‑MM‑DD</span>.
          </p>
        </div>

        {state?.ok === false && (
          <div
            role="alert"
            className="rounded-lg border p-4 text-sm bg-red-500/15 text-red-100 border-red-200/30 backdrop-blur-sm"
          >
            {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={!gateOpen || pending}
          aria-busy={pending}
          className="
            w-full h-11 rounded-md
            bg-white/20 hover:bg-white/30 text-white
            border border-white/30
            backdrop-blur-sm
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
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
        </button>

        <p className="text-[11px] leading-5 text-white/80 text-center">
          Dibuat untuk verifikasi; data tidak disimpan di perangkat Anda.
        </p>
      </form>
    </>
  );
}
