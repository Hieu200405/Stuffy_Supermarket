FROM node:18-alpine AS builder
WORKDIR /app

# Copy shared configs and packages
COPY package*.json ./
COPY packages ./packages
COPY admin-app/package*.json ./admin-app/

# Install root dependencies (including workspaces)
RUN npm install

# Build the specific app
COPY admin-app ./admin-app
WORKDIR /app/admin-app
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/admin-app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
