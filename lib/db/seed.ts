import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { students, settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);

    const cfg = await db.select().from(settings).limit(1);
    if (cfg.length === 0) {
        await db.insert(settings).values({ isCheckOpen: true, openAt: null });
    } else {
        await db.update(settings).set({ isCheckOpen: true, openAt: null }).where(eq(settings.id, cfg[0].id));
    }

    await pool.query("TRUNCATE TABLE students RESTART IDENTITY");

    const data = [
        { nis: "20240001", nama: "Andi Wijaya", kelas: "XII-A", tanggalLahir: "2006-01-12", statusLulus: true },
        { nis: "20240002", nama: "Budi Santoso", kelas: "XII-A", tanggalLahir: "2006-03-05", statusLulus: false },
        { nis: "20240003", nama: "Citra Lestari", kelas: "XII-B", tanggalLahir: "2006-05-19", statusLulus: true },
        { nis: "20240004", nama: "Dewi Kusuma", kelas: "XII-B", tanggalLahir: "2006-07-02", statusLulus: false },
        { nis: "20240005", nama: "Eko Pratama", kelas: "XII-C", tanggalLahir: "2006-09-23", statusLulus: true },
        { nis: "20240006", nama: "Fajar Nugraha", kelas: "XII-C", tanggalLahir: "2006-11-11", statusLulus: true },
        { nis: "20240007", nama: "Gita Maharani", kelas: "XII-A", tanggalLahir: "2006-02-08", statusLulus: false },
        { nis: "20240008", nama: "Hadi Saputra", kelas: "XII-B", tanggalLahir: "2006-04-21", statusLulus: true },
        { nis: "20240009", nama: "Intan Permata", kelas: "XII-C", tanggalLahir: "2006-06-14", statusLulus: false },
        { nis: "20240010", nama: "Joko Susilo", kelas: "XII-A", tanggalLahir: "2006-08-27", statusLulus: true },
    ];

    for (const s of data) {
        await db.insert(students).values(s).onConflictDoUpdate({ target: students.nis, set: s });
    }

    await pool.end();
    console.log("✅ Seed complete");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
