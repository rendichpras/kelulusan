import { db } from "@/lib/db/drizzle";
import { students } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
    const [total] = await db.select({ c: sql<number>`count(*)` }).from(students);
    const [opened] = await db
        .select({ c: sql<number>`count(*)` })
        .from(students)
        .where(eq(students.isOpen, true));
    const [lulus] = await db
        .select({ c: sql<number>`count(*)` })
        .from(students)
        .where(eq(students.statusLulus, true));
    const [tdk] = await db
        .select({ c: sql<number>`count(*)` })
        .from(students)
        .where(eq(students.statusLulus, false));

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card><CardHeader><CardTitle>Total Peserta</CardTitle></CardHeader><CardContent className="text-3xl">{Number(total.c)}</CardContent></Card>
            <Card><CardHeader><CardTitle>Sudah Dibuka</CardTitle></CardHeader><CardContent className="text-3xl">{Number(opened.c)}</CardContent></Card>
            <Card><CardHeader><CardTitle>Lulus</CardTitle></CardHeader><CardContent className="text-3xl">{Number(lulus.c)}</CardContent></Card>
            <Card><CardHeader><CardTitle>Tidak Lulus</CardTitle></CardHeader><CardContent className="text-3xl">{Number(tdk.c)}</CardContent></Card>
        </div>
    );
}