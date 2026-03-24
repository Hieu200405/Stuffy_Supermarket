# 🛒 Stuffy Supermarket - Micro Frontends E-commerce

A modern, scalable e-commerce platform built using a **Micro Frontends** architecture. The project leverages **Webpack 5 Module Federation** to split the frontend into independent, hot-deployable, and scalable sub-applications that come together seamlessly at runtime.

## 🏗️ Architecture & Apps

The ecosystem consists of 5 independent applications:

- **📦 Container (`container`)**: The main App Shell that uses `React.lazy` to dynamically orchestrate and load all other components (Port 3000).
- **🏷️ Header App (`header-app`)**: Global site header and navigation (Port 3001).
- **🛍️ Product App (`product-app`)**: Product catalog display and interaction (Port 3002).
- **🛒 Cart App (`cart-app`)**: Shopping cart and total price generation (Port 3003).
- **⚙️ Admin App (`admin-app`)**: Dashboard for managing products and inventory (Port 3004).

## 🚀 Key Technical Highlights

*   **Webpack Module Federation (MFE)**: True isolated development environments.
*   **Decoupled Communication**: Employs Global Event Bus via `window.dispatchEvent(new CustomEvent())` for seamless cross-app interactions (e.g., clicking "Add to cart" in `product-app` instantly updates the state in `cart-app`) without relying on a bulky shared store like Redux.
*   **React Suspense**: Remote components are dynamically fetched asynchronously over the network with elegant loading states.
*   **Singleton Dependencies**: `react` and `react-dom` are rigorously configured as `singleton: true` across all Webpack configs to prevent hook collision errors and drastically minimize total network transfer load.
*   **Optimized Dockerization**: Each app operates via a multi-stage Docker build, generating a production-optimized package served by an ultra-light **Nginx Alpine** server.

## 🛠️ Tech Stack

- **Frontend Core**: React 19, JavaScript (ES6+ JSX)
- **Bundler & Compiler**: Webpack 5, Babel
- **Containerization**: Docker, Docker Compose, Nginx
- **CI/CD Automation**: GitHub Actions (Matrix Pipeline)
- **Hosting**: Docker Hub Registry + Render Web Services

## 🏃‍♂️ Running Locally

### Option 1: Using Docker Compose (Production Build Simulation)
Ensure Docker Desktop is open. In the root directory, run:
```bash
docker-compose up -d --build
```
Navigate to `http://localhost:3000` to view the fully integrated app. Containers are mapped precisely to their designated output ports.

### Option 2: Using Node/NPM (Live Development Mode)
Run each application's Webpack Dev Server in a separate terminal:
```bash
cd header-app && npm start
cd product-app && npm start
cd cart-app && npm start
cd admin-app && npm start
cd container && npm start
```
After successful compilation, head over to `http://localhost:3000`.

## 🌐 Complete CI/CD Pipeline

The `.github/workflows/ci-cd.yml` maintains a professional deployment cycle:
1. Pushing/Merging code into `main` automatically fires off GitHub Actions.
2. A Matrix Strategy fires 5 runners synchronously to build all 5 sub-apps at blistering speeds.
3. Multi-stage Docker images are pushed directly to Docker Hub (`username/stuffy-[app-name]:latest`).
4. (Optional) Webhook triggers prompt **Render.com** to pull the latest images and refresh the website with zero downtime.
