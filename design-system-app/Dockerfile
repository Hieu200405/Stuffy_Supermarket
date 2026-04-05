FROM node:20-alpine AS builder
WORKDIR /app

# Copy shared configs and packages
COPY package*.json ./
COPY packages ./packages
COPY design-system-app/package*.json ./design-system-app/

# Install root and design-system-app dependencies
RUN npm install --workspace=design-system-app --include-workspace-root

# Build the specific app
COPY design-system-app ./design-system-app
WORKDIR /app/design-system-app
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/design-system-app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
