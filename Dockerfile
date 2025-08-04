FROM node:22.13.1-alpine3.21

# Create non-root user for security
RUN addgroup -S phisiowebgroup && adduser -S phisiowebuser -G phisiowebgroup

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Copy rest of the source code and fix ownership for non-root user
COPY . .
RUN chown -R phisiowebuser:phisiowebgroup /app

USER phisiowebuser

EXPOSE 5173
