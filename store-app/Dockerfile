FROM node:18-alpine AS builder
WORKDIR /app

# Copy shared configs and packages
COPY package*.json ./
COPY packages ./packages
COPY store-app/package*.json ./store-app/

# Install root dependencies (including workspaces)
RUN npm install

# Build the specific app
COPY store-app ./store-app
WORKDIR /app/store-app
RUN npx webpack --mode production

FROM nginx:alpine
COPY --from=builder /app/store-app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
