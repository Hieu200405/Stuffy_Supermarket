FROM node:18-alpine AS builder
WORKDIR /app

# Copy shared configs and packages
COPY package*.json ./
COPY packages ./packages
COPY 3d-viewer-app/package*.json ./3d-viewer-app/

# Install root dependencies (including workspaces)
RUN npm install

# Build the specific app
COPY 3d-viewer-app ./3d-viewer-app
WORKDIR /app/3d-viewer-app
RUN npx webpack --mode production

FROM nginx:alpine
COPY --from=builder /app/3d-viewer-app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
