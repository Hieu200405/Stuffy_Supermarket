FROM node:20-alpine AS builder
WORKDIR /app

# Copy shared configs and packages
COPY package*.json ./
COPY packages ./packages
COPY product-app/package*.json ./product-app/

# Install root and product-app dependencies
RUN npm install --workspace=product-app --include-workspace-root

# Build the specific app
COPY product-app ./product-app
WORKDIR /app/product-app
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/product-app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
