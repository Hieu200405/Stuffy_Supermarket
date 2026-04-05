FROM node:18-alpine AS builder
WORKDIR /app

# Copy shared configs and packages
COPY package*.json ./
COPY packages ./packages
COPY product-app/package*.json ./product-app/

# Install root dependencies (including workspaces)
RUN npm install

# Build the specific app
COPY product-app ./product-app
WORKDIR /app/product-app
RUN npx webpack --mode production

FROM nginx:alpine
COPY --from=builder /app/product-app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
