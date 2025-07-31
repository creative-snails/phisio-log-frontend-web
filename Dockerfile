FROM node:22.13.1-alpine3.21

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5173 4444
