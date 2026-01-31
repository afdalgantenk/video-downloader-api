 import express from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
const TMP = "/tmp";

app.get("/", (req, res) => {
  res.send("API Downloader Aktif 🚀");
});

app.get("/download", (req, res) => {
  const { type, url } = req.query;

  if (!type || !url) {
    return res.status(400).send("Parameter tidak lengkap");
  }

  let cmd = "";
  const output = `${TMP}/%(title)s.%(ext)s`;

  if (type === "mp3") {
    // YouTube MP3 HQ
    cmd = `yt-dlp -x --audio-format mp3 --audio-quality 0 --restrict-filenames -o "${output}" "${url}"`;
  }

  else if (type === "mp4") {
    // YouTube MP4 best
    cmd = `yt-dlp -f "bv*+ba/b" --merge-output-format mp4 --restrict-filenames -o "${output}" "${url}"`;
  }

  else if (type === "tiktok") {
    // TikTok HD No WM
    cmd = `yt-dlp -f "bv*+ba/b" --merge-output-format mp4 --restrict-filenames --no-playlist -o "${output}" "${url}"`;
  }

  else if (type === "ig") {
    // Instagram Video
    cmd = `yt-dlp -f "bv*+ba/b" --merge-output-format mp4 --restrict-filenames --no-playlist -o "${output}" "${url}"`;
  }

  else {
    return res.status(400).send("Type tidak dikenali");
  }

  exec(cmd, { shell: "/bin/bash" }, (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      return res.status(500).send(stderr || "Gagal download");
    }

    fs.readdir(TMP, (err, files) => {
      if (err || files.length === 0) {
        return res.status(500).send("File tidak ditemukan");
      }

      const filesSorted = files
        .map(f => ({
          name: f,
          time: fs.statSync(path.join(TMP, f)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);

      const latestFile = path.join(TMP, filesSorted[0].name);

      res.download(latestFile, () => {
        fs.unlink(latestFile, () => {});
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});
