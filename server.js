import express from "express";
import { exec } from "child_process";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;
const TMP = "/tmp";

app.get("/", (req, res) => {
  res.send("API Downloader Aktif 🚀");
});

app.get("/download", (req, res) => {
  const { type, url } = req.query;
  if (!url) return res.status(400).send("URL kosong");

  const id = Date.now();
  let filename = "";
  let cmd = "";

  if (type === "mp3") {
    filename = `${TMP}/${id}.mp3`;
    cmd = `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${filename}" "${url}"`;
  }
  else if (type === "mp4") {
    filename = `${TMP}/${id}.mp4`;
    cmd = `yt-dlp -f mp4 -o "${filename}" "${url}"`;
  }
  else if (type === "tiktok") {
    filename = `${TMP}/${id}.mp4`;
    cmd = `yt-dlp -o "${filename}" "${url}"`;
  }
  else {
    return res.status(400).send("Type tidak valid");
  }

  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error("STDERR:", stderr);
      return res.status(500).send(stderr || "yt-dlp error");
    }

    if (!fs.existsSync(filename)) {
      return res.status(500).send("File tidak terbentuk");
    }

    res.download(filename, () => {
      fs.unlink(filename, () => {});
    });
  });
});

app.listen(PORT, () => {
  console.log("Server jalan di port", PORT);
});
