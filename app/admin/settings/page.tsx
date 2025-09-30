import { db } from "@/lib/db/drizzle";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

async function readConfig() {
    const rows = await db.select().from(settings).limit(1);
    if (rows.length) return rows[0];
    const [r] = await db.insert(settings).values({ isCheckOpen: false, openAt: null }).returning();
    return r;
}

export default async function SettingsPage() {
    const cfg = await readConfig();

    return (
        <Card>
            <CardHeader><CardTitle>Pengaturan Cek Kelulusan</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <form action={saveSettings} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="isCheckOpen" defaultChecked={cfg.isCheckOpen as any} />
                        <span>Buka Sekarang</span>
                    </label>
                    <div>
                        <label className="block text-sm font-medium">Jadwalkan Buka (opsional)</label>
                        <Input type="datetime-local" name="openAt" defaultValue={cfg.openAt ? new Date(cfg.openAt as any).toISOString().slice(0, 16) : ""} />
                    </div>
                    <Button className="self-end">Simpan</Button>
                </form>
            </CardContent>
        </Card>
    );
}

export async function saveSettings(formData: FormData) {
    "use server";
    const isCheckOpen = formData.get("isCheckOpen") === "on";
    const openAtRaw = String(formData.get("openAt") || "");
    const openAt = openAtRaw ? new Date(openAtRaw) : null;
    const rows = await db.select().from(settings).limit(1);
    if (rows.length) {
        await db.update(settings).set({ isCheckOpen, openAt }).where(eq(settings.id, rows[0].id));
    } else {
        await db.insert(settings).values({ isCheckOpen, openAt });
    }
    revalidatePath("/admin/settings");
}