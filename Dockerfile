FROM node:22.13.1-alpine3.21

WORKDIR /app

# Ensure we always use the public npm registry in Docker builds
RUN npm config set registry https://registry.npmjs.org/

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
