import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE = "https://thanhubstore.com/api/v1";
const API_KEY = process.env.THANHUB_API_KEY;

app.use(helmet());
app.use(express.json({ limit: "30kb" }));
app.use(express.static("public"));
app.use("/api/", rateLimit({ windowMs: 60_000, limit: 50 }));

function authHeaders() {
  if (!API_KEY) throw new Error("THANHUB_API_KEY belum diatur di server.");
  return {
    "Authorization": `Bearer ${API_KEY}`,
    "Accept": "application/json",
    "Content-Type": "application/json"
  };
}

async function thanhHub(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.message || `Thanhub API error (${response.status})`);
    error.status = response.status;
    error.details = body;
    throw error;
  }
  return body;
}

app.get("/api/products", async (_req, res) => {
  try {
    const data = await thanhHub("/products");
    res.json(data);
  } catch (err) {
    res.status(err.status || 502).json({ error: err.message });
  }
});

app.get("/api/balance", async (_req, res) => {
  try {
    const data = await thanhHub("/balance");
    res.json(data);
  } catch (err) {
    res.status(err.status || 502).json({ error: err.message });
  }
});

/*
 * PEMBAYARAN BELUM DIHUBUNGKAN.
 * Jangan panggil POST /orders hanya berdasarkan tombol "saya sudah bayar".
 * Setelah memilih penyedia QRIS, verifikasi pembayaran harus dilakukan
 * di server melalui webhook resmi dengan signature yang valid.
 */
app.post("/api/orders", async (_req, res) => {
  res.status(503).json({
    error: "Checkout belum aktif. Hubungkan gateway QRIS dan verifikasi webhook terlebih dahulu."
  });
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`WINZXITER berjalan di http://localhost:${PORT}`);
});
