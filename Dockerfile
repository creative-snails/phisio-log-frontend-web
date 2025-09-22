FROM node:20-alpine

WORKDIR /app

# Ensure we always use the public npm registry in Docker builds
RUN npm config set registry https://registry.npmjs.org/

# Copy only the entrypoint script; app source will be bind-mounted at runtime
COPY scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5173

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
