import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { db } from "@/lib/db/drizzle";
import { students } from "@/lib/db/schema";
import { studentExcelSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ ok: false, message: "File tidak ada" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const wb = XLSX.read(buffer, { type: "buffer" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet) as any[];

    const parsed = studentExcelSchema.parse(
        rows.map((r) => ({
            nis: String(r.nis).trim(),
            nama: String(r.nama).trim(),
            kelas: String(r.kelas).trim(),
            tanggalLahir: r.tanggal_lahir,
            statusLulus: r.status,
        }))
    );

    type NewStudent = typeof students.$inferInsert;
    const payload: NewStudent[] = parsed;

    for (const p of payload) {
        await db
            .insert(students)
            .values(p)
            .onConflictDoUpdate({
                target: students.nis,
                set: {
                    nama: p.nama,
                    kelas: p.kelas,
                    tanggalLahir: p.tanggalLahir,
                    statusLulus: p.statusLulus,
                },
            });
    }

    return NextResponse.json({ ok: true, count: payload.length });
}