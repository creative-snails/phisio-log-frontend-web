## 🐳 Docker Development Setup

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your system
  > Docker Desktop includes both Docker Engine and Docker Compose. It also provides a GUI for easier management of containers and images.
- If you're using Linux, you can install Docker and Docker Compose separately. See [Install Docker Engine on Linux](https://docs.docker.com/engine/install/)

### Getting Started

- Clone the repository (if you haven't already):

  ```bash
  git clone <repository-url>
  cd phisio-log-frontend-web
  ```

  IMPORTANT NOTE:<br> Even though you don’t need to install dependencies locally, doing so is recommended to ensure IDEs provide proper code highlighting, linting, and other features.<br> However, **do not** run `npm install` or `yarn install`, as they may modify your lockfile. Instead, use `npm ci` or `yarn install --immutable` for a clean install.

- Build and run the app with Docker Compose:

  ```bash
  docker compose up -d   # -d = detached mode (runs in the background leaving terminal free)
  ```

  - You can now access the application:
    <br>**Frontend (Vite dev server)**: http://localhost:5173
    <br>**Mock API (json-server)**: http://localhost:4444

### Stopping the Application

- To stop all running services and remove associated containers and networks:

  ```bash
  docker compose down
  ```

### Rebuilding the Application

- If you make changes to the Dockerfile, add or remove dependencies, change files used during build (like `package.json`, `.env`), or want to ensure everything is up-to-date, you should rebuild (and run) the application with:

  ```bash
  docker compose up -d --build
  ```

- If you experience any issues, you can try removing all containers and images, rebuilding everything from scratch, and starting fresh (copy, paste, and run the following block):

  ```bash
  docker compose down --rmi all &&
  docker compose build --no-cache &&
  docker compose up -d
  ```
