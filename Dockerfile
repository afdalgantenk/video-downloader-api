FROM python:3.11-slim

# install nodejs 18
RUN apt update && \
    apt install -y curl ffmpeg ca-certificates && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt install -y nodejs && \
    apt clean

# install yt-dlp (official, python 3.11 compatible)
RUN pip install -U yt-dlp

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
