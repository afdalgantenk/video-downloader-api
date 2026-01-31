FROM node:18-bullseye

# install ffmpeg + tools
RUN apt update && \
    apt install -y ffmpeg curl ca-certificates python3 && \
    apt clean

# install yt-dlp (official binary)
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    -o /usr/local/bin/yt-dlp && \
    chmod +x /usr/local/bin/yt-dlp

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
