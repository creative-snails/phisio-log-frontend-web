## 🐳 Docker Development Setup

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running on your system
  > Docker Desktop includes both Docker Engine and Docker Compose, plus a GUI for easier management.
- If you're using Linux, you can install Docker and Docker Compose separately. See [Install Docker Engine on Linux](https://docs.docker.com/engine/install/)

<br>

### Getting Started

1. **Clone the repository (if you haven't already):**

   ```bash
   git clone <repository-url>
   cd phisio-log-frontend-web
   ```

   ⚠️ While dependencies are handled inside Docker, we recommend installing them locally too for IDE features like linting and autocomplete.
   - Use `npm ci` or `yarn install --immutable`
   - Avoid plain `npm install` or `yarn install`

2. **Build and start the app:**

   Note that initial build will take longer since all base images and dependencies need to be pulled and installed. Subsequent runs will be much faster.

   ```bash
   docker compose up   # add -d for detached mode (runs in the background leaving terminal free)
   ```

   - You can now access the application:
     <br>**Frontend (Vite dev server)**: http://localhost:5173
     <br>**Mock API (json-server)**: http://localhost:4444

<br>

### Stopping & Starting the Application after initial build/run

- To stop or remove services/containers:

  ```bash
  docker compose stop   # Stop all running containers (services) without removing them
  # or
  docker compose down   # Remove all running containers (services) and their associated networks
  ```

- To start containers/services again:

  ```bash
  docker compose start  # Start all stopped containers (services) - only if 'docker compose stop' was run
  # or
  docker compose up     # Start all containers (services) - must be used if 'docker compose down' was run
  ```

ℹ️ **Summary:**

- use `docker compose stop` / `docker compose start` (or `up`) to quickly stop/start services normally during development
- use `docker compose down` to stop and remove services and their networks in case you need to free up resources (followed by `docker compose up` to start again)
- use `docker compose restart` if you need to restart the services (e.g., after changing environment variables in compose.yml or running into issues)

<br>

### Rebuilding the Application

Rebuild when:

- Dockerfile is modified
- Dependencies are added/removed or build-related files updated (package.json, package-lock.json, .env)
- Issues are experienced even after running `docker compose restart`

  ```bash
  docker compose up --build
  ```

* If issues still persist, do a clean rebuild from scratch (paste & run the following block):

  ```bash
  docker compose down --rmi all &&
  docker compose build --no-cache &&
  docker compose up
  ```
