"use server";

import { db } from "@/lib/db/drizzle";
import { students, settings } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { encodeId } from "@/lib/utils/token"

export async function checkGraduationAction(formData: FormData) {
    const nis = (formData.get("nis") as string)?.trim();
    const tanggal = formData.get("tanggal") as string;

    if (!nis || !tanggal) {
        return { ok: false, message: "NIS dan tanggal lahir wajib diisi." };
    }

    const [cfg] = await db.select().from(settings).limit(1);
    const nowOpen = cfg?.isCheckOpen || (cfg?.openAt ? new Date(cfg.openAt) <= new Date() : false);
    if (!nowOpen) {
        return { ok: false, message: "Fitur cek kelulusan belum dibuka." };
    }


    const [s] = await db
        .select()
        .from(students)
        .where(and(eq(students.nis, nis), eq(students.tanggalLahir, tanggal)))
        .limit(1);

    if (!s) {
        return { ok: false, message: "Data tidak ditemukan. Periksa NIS/tanggal lahir." };
    }

    if (!s.isOpen) {
        await db.update(students).set({ isOpen: true, tanggalDibuka: new Date() }).where(eq(students.id, s.id));
    }

    redirect(`/result?sid=${encodeId(s.id)}`);
}