import express from "express";
import { exec } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API Downloader Aktif 🚀");
});

app.get("/download", (req, res) => {
  const { type, url } = req.query;
  if (!url) return res.status(400).send("URL kosong");

  let cmd = "";

  if (type === "mp3") {
    cmd = `yt-dlp -x --audio-format mp3 "${url}"`;
  } else if (type === "mp4") {
    cmd = `yt-dlp -f mp4 "${url}"`;
  } else if (type === "tiktok") {
    cmd = `yt-dlp "${url}"`;
  } else if (type === "ig") {
    cmd = `yt-dlp "${url}"`;
  } else {
    return res.status(400).send("Type tidak dikenal");
  }

  exec(cmd, (err) => {
    if (err) return res.status(500).send("Gagal proses");
    res.send("Berhasil diproses");
  });
});

app.listen(PORT, () => {
  console.log("Server jalan di port", PORT);
});
