FROM node:18-alpine AS builder
WORKDIR /app

# Copy shared configs and packages
COPY package*.json ./
COPY packages ./packages
COPY container/package*.json ./container/

# Install root dependencies (including workspaces)
RUN npm install

# Build the specific app
COPY container ./container
WORKDIR /app/container
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/container/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
