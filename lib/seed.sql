
-- Seed for testing environment
-- Assumes tables already created by Drizzle migrations
-- Run with: psql "$DATABASE_URL" -f seed.sql

-- SETTINGS: open now
INSERT INTO settings (is_check_open, open_at)
VALUES (true, NULL)
ON CONFLICT (id) DO UPDATE SET is_check_open = EXCLUDED.is_check_open, open_at = EXCLUDED.open_at;

-- STUDENTS
-- Columns: nis, nama, kelas, tanggal_lahir, status_lulus, is_open, tanggal_dibuka
TRUNCATE TABLE students RESTART IDENTITY;

INSERT INTO students (nis, nama, kelas, tanggal_lahir, status_lulus, is_open, tanggal_dibuka) VALUES
('20240001','Andi Wijaya','XII-A','2006-01-12', true,  false, NULL),
('20240002','Budi Santoso','XII-A','2006-03-05', false, false, NULL),
('20240003','Citra Lestari','XII-B','2006-05-19', true,  false, NULL),
('20240004','Dewi Kusuma','XII-B','2006-07-02', false, false, NULL),
('20240005','Eko Pratama','XII-C','2006-09-23', true,  false, NULL),
('20240006','Fajar Nugraha','XII-C','2006-11-11', true,  false, NULL),
('20240007','Gita Maharani','XII-A','2006-02-08', false, false, NULL),
('20240008','Hadi Saputra','XII-B','2006-04-21', true,  false, NULL),
('20240009','Intan Permata','XII-C','2006-06-14', false, false, NULL),
('20240010','Joko Susilo','XII-A','2006-08-27', true,  false, NULL),
('20240011','Kartika Ayu','XII-B','2006-10-03', true,  false, NULL),
('20240012','Lukman Hakim','XII-C','2006-12-30', false, false, NULL),
('20240013','Maya Sari','XII-A','2006-01-25', true,  false, NULL),
('20240014','Nanda Putri','XII-B','2006-03-18', false, false, NULL),
('20240015','Oka Pradana','XII-C','2006-05-09', true,  false, NULL),
('20240016','Putri Amelia','XII-A','2006-07-20', true,  false, NULL),
('20240017','Qori Rahma','XII-B','2006-09-01', false, false, NULL),
('20240018','Rizky Hidayat','XII-C','2006-10-22', true,  false, NULL),
('20240019','Siti Aisyah','XII-A','2006-12-05', false, false, NULL),
('20240020','Teguh Firmansyah','XII-B','2006-02-14', true,  false, NULL);
