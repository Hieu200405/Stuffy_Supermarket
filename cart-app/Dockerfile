FROM node:18-alpine AS builder
WORKDIR /app

# Copy shared configs and packages
COPY package*.json ./
COPY packages ./packages
COPY cart-app/package*.json ./cart-app/

# Install root dependencies (including workspaces)
RUN npm install

# Build the specific app
COPY cart-app ./cart-app
WORKDIR /app/cart-app
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/cart-app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
