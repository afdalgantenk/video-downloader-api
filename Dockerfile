FROM node:18-bullseye

# install yt-dlp & ffmpeg
RUN apt update && \
    apt install -y yt-dlp ffmpeg && \
    apt clean

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
