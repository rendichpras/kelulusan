import { db } from "@/lib/db/drizzle";
import { students } from "@/lib/db/schema";
import { desc, eq, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

async function getData(q?: string) {
    if (!q) return db.select().from(students).orderBy(desc(students.id)).limit(200);
    return db
        .select()
        .from(students)
        .where(or(ilike(students.nama, `%${q}%`), ilike(students.nis, `%${q}%`), ilike(students.kelas, `%${q}%`)))
        .orderBy(desc(students.id))
        .limit(200);
}

export default async function StudentsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q } = await searchParams;
    const data = await getData(q);

    return (
        <Card>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Peserta Didik</CardTitle>
                <form className="flex gap-2" action="/admin/students" method="GET">
                    <Input name="q" placeholder="Cari nama/NIS/kelas" defaultValue={q || ""} />
                    <Button type="submit">Cari</Button>
                </form>
            </CardHeader>
            <CardContent>
                <form action={createAction} className="grid grid-cols-1 sm:grid-cols-6 gap-2 mb-4">
                    <Input name="nis" placeholder="NIS" required className="sm:col-span-1" />
                    <Input name="nama" placeholder="Nama" required className="sm:col-span-2" />
                    <Input name="kelas" placeholder="Kelas" required className="sm:col-span-1" />
                    <Input name="tanggal_lahir" type="date" required className="sm:col-span-1" />
                    <select name="status_lulus" className="border rounded px-2 py-2 sm:col-span-1">
                        <option value="false">Tidak Lulus</option>
                        <option value="true">Lulus</option>
                    </select>
                    <Button type="submit" className="sm:col-span-6">Tambah</Button>
                </form>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left border-b">
                                <th className="py-2">NIS</th>
                                <th>Nama</th>
                                <th>Kelas</th>
                                <th>Tgl Lahir</th>
                                <th>Lulus</th>
                                <th>Dibuka?</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((s) => (
                                <tr key={s.id} className="border-b last:border-0">
                                    <td className="py-2">{s.nis}</td>
                                    <td>{s.nama}</td>
                                    <td>{s.kelas}</td>
                                    <td>{s.tanggalLahir}</td>
                                    <td>{s.statusLulus ? "Ya" : "Tidak"}</td>
                                    <td>{s.isOpen ? "Ya" : "Belum"}</td>
                                    <td className="flex gap-2 py-2">
                                        <form action={togglePassAction}>
                                            <input type="hidden" name="id" value={s.id} />
                                            <Button variant="outline" size="sm">Toggle Lulus</Button>
                                        </form>
                                        <form action={resetOpenAction}>
                                            <input type="hidden" name="id" value={s.id} />
                                            <Button variant="outline" size="sm">Reset Open</Button>
                                        </form>
                                        <form action={deleteAction}>
                                            <input type="hidden" name="id" value={s.id} />
                                            <Button variant="destructive" size="sm">Hapus</Button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

export async function createAction(formData: FormData) {
    "use server";
    const nis = String(formData.get("nis") || "").trim();
    const nama = String(formData.get("nama") || "").trim();
    const kelas = String(formData.get("kelas") || "").trim();
    const tanggal = String(formData.get("tanggal_lahir") || "");
    const status = String(formData.get("status_lulus") || "false") === "true";
    if (!nis || !nama || !kelas || !tanggal) return;
    await db.insert(students).values({ nis, nama, kelas, tanggalLahir: tanggal, statusLulus: status });
    revalidatePath("/admin/students");
}

export async function deleteAction(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!id) return;
    await db.delete(students).where(eq(students.id, id));
    revalidatePath("/admin/students");
}

export async function togglePassAction(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!id) return;
    const [s] = await db.select().from(students).where(eq(students.id, id)).limit(1);
    if (!s) return;
    await db.update(students).set({ statusLulus: !s.statusLulus }).where(eq(students.id, id));
    revalidatePath("/admin/students");
}

export async function resetOpenAction(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!id) return;
    await db.update(students).set({ isOpen: false, tanggalDibuka: null }).where(eq(students.id, id));
    revalidatePath("/admin/students");
}