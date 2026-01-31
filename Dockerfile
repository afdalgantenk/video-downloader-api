FROM node:18-bullseye

# install Python 3.11 + ffmpeg + tools
RUN apt update && \
    apt install -y python3.11 python3.11-distutils ffmpeg curl ca-certificates && \
    update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1 && \
    apt clean

# install yt-dlp (official)
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    -o /usr/local/bin/yt-dlp && \
    chmod +x /usr/local/bin/yt-dlp

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
