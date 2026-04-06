FROM public.ecr.aws/docker/library/node:20-alpine AS builder
WORKDIR /app

# Copy shared configs and packages
COPY package*.json ./
COPY packages ./packages
COPY store-app/package*.json ./store-app/

# Install root and store-app dependencies
RUN npm install --workspace=store-app --include-workspace-root

# Build the specific app
COPY store-app ./store-app
WORKDIR /app/store-app
RUN npm run build

FROM public.ecr.aws/docker/library/nginx:alpine
COPY --from=builder /app/store-app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
