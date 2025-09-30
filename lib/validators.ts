import { z } from "zod";

const dateToYMD = z.coerce.date().transform((d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
});

export const studentSchema = z.object({
  nis: z.string().min(4).max(32),
  nama: z.string().min(1),
  kelas: z.string().min(1),
  tanggalLahir: dateToYMD,
  statusLulus: z.coerce.boolean(),
});

export const studentExcelSchema = z.array(studentSchema);
