# WINZXITER Store — starter integrasi Thanhub API

## Yang sudah disiapkan
- Tampilan katalog responsif untuk HP.
- Backend Node.js yang memanggil `GET https://thanhubstore.com/api/v1/products`.
- Endpoint backend untuk `GET /balance`.
- API Key disimpan di environment server, bukan di browser.
- Checkout sengaja belum aktif sampai gateway QRIS dan webhook pembayaran tersedia.

## Menjalankan
1. Pasang Node.js versi 20 atau lebih baru.
2. Ekstrak folder ini.
3. Jalankan `npm install`.
4. Salin `.env.example` menjadi `.env`.
5. Isi `THANHUB_API_KEY` di `.env` dengan API Key reseller yang dibuat di Thanhub.
6. Jalankan `npm start`.
7. Buka `http://localhost:3000`.

## Endpoint dari dokumentasi Thanhub yang terlihat
- Base URL: `https://thanhubstore.com/api/v1`
- Auth: `Authorization: Bearer <API_KEY>` (alternatif header `X-API-Key`)
- `GET /balance`
- `GET /products`
- `GET /products/:productId`
- `POST /orders` dengan body contoh `{"variant_id":19,"qty":1,"ref":"ORDER-ID-UNIK"}`
- `GET /orders/:orderId`
- `GET /orders`

## Sebelum website dipakai pelanggan
- Cocokkan bentuk JSON respons `GET /products`; parser tampilan saat ini mencoba beberapa nama field umum.
- Tambahkan gateway QRIS resmi dan verifikasi webhook di backend.
- Setelah webhook memastikan pembayaran lunas, backend baru boleh memanggil `POST /orders`.
- Buat `ref` unik untuk tiap transaksi agar tidak terjadi pesanan ganda.
- Simpan status transaksi di database; jangan mengandalkan memori server.
- Jangan pernah menaruh API Key di file HTML, JavaScript browser, screenshot, atau repositori publik.
- Atur IP allowlist di dashboard Thanhub ke IP server hosting setelah alamat IP server diketahui.
- Lakukan uji coba dengan produk legal yang memang berhak dijual dan saldo reseller secukupnya.

## Catatan
Dokumentasi pada screenshot menyebut batas 60 request/menit dan 20 order/menit. Jangan polling terlalu sering.
