FROM node:18-bullseye

# install ffmpeg + dependencies
RUN apt update && \
    apt install -y ffmpeg curl ca-certificates && \
    apt clean

# install yt-dlp binary
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    -o /usr/local/bin/yt-dlp && \
    chmod +x /usr/local/bin/yt-dlp

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
