FROM public.ecr.aws/docker/library/node:20-alpine AS builder
WORKDIR /app

# Copy shared configs and packages
COPY package*.json ./
COPY packages ./packages
COPY container/package*.json ./container/

# Install root and container dependencies
RUN npm install --workspace=container --include-workspace-root

# Build the specific app
COPY container ./container
WORKDIR /app/container
RUN npm run build

FROM public.ecr.aws/docker/library/nginx:alpine
COPY --from=builder /app/container/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
