import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload Data Peserta (Excel)</CardTitle>
            </CardHeader>
            <CardContent>
                <form action="/api/upload" method="POST" encType="multipart/form-data" className="space-y-3">
                    <input type="file" name="file" accept=".xlsx,.xls" required className="block" />
                    <Button type="submit">Upload</Button>
                </form>
                <p className="text-sm text-muted-foreground mt-4">
                    Kolom wajib: <code>nis, nama, kelas, tanggal_lahir (yyyy-mm-dd), status (TRUE/FALSE)</code>
                </p>
            </CardContent>
        </Card>
    );
}