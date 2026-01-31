import express from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
const TMP = "/tmp";

// home check
app.get("/", (req, res) => {
  res.send("API Downloader Aktif 🚀");
});

// download endpoint
app.get("/download", (req, res) => {
  const { type, url } = req.query;

  if (!url || !type) {
    return res.status(400).send("Parameter tidak lengkap");
  }

  let cmd = "";
  let outputTemplate = `${TMP}/%(title)s.%(ext)s`;

  switch (type) {

    // ===== YOUTUBE MP3 =====
    case "mp3":
      cmd = `
        yt-dlp
        -x
        --audio-format mp3
        --audio-quality 0
        --restrict-filenames
        -o "${outputTemplate}"
        "${url}"
      `;
      break;

    // ===== YOUTUBE MP4 =====
    case "mp4":
      cmd = `
        yt-dlp
        -f "bv*+ba/b"
        --merge-output-format mp4
        --restrict-filenames
        -o "${outputTemplate}"
        "${url}"
      `;
      break;

    // ===== TIKTOK NO WM + HD =====
    case "tiktok":
      cmd = `
        yt-dlp
        -f "bv*+ba/b"
        --merge-output-format mp4
        --restrict-filenames
        --no-playlist
        -o "${outputTemplate}"
        "${url}"
      `;
      break;

    // ===== INSTAGRAM VIDEO =====
    case "ig":
      cmd = `
        yt-dlp
        -f "bv*+ba/b"
        --merge-output-format mp4
        --restrict-filenames
        --no-playlist
        -o "${outputTemplate}"
        "${url}"
      `;
      break;

    default:
      return res.status(400).send("Type tidak dikenali");
  }

  exec(cmd, { shell: "/bin/bash" }, (err, stdout, stderr) => {
    if (err) {
      console.error("yt-dlp error:", stderr);
      return res.status(500).send(stderr || "Gagal download");
    }

    // cari file hasil download
    fs.readdir(TMP, (err, files) => {
      if (err || !files.length) {
        return res.status(500).send("File tidak ditemukan");
      }

      // ambil file terbaru
      const filesWithPath = files.map(f => ({
        name: f,
        time: fs.statSync(path.join(TMP, f)).mtime.getTime()
      }));

      filesWithPath.sort((a, b) => b.time - a.time);
      const latestFile = path.join(TMP, filesWithPath[0].name);

      res.download(latestFile, err => {
        // auto delete
        fs.unlink(latestFile, () => {});
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});
