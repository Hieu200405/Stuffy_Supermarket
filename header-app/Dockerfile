FROM public.ecr.aws/docker/library/node:20-alpine AS builder
WORKDIR /app

# Copy shared configs and packages
COPY package*.json ./
COPY packages ./packages
COPY header-app/package*.json ./header-app/

# Install root and header-app dependencies
RUN npm install --workspace=header-app --include-workspace-root

# Build the specific app
COPY header-app ./header-app
WORKDIR /app/header-app
# Nhận API Key từ CI/CD Secret lúc build (--build-arg)
ARG GEMINI_API_KEY=""
ENV GEMINI_API_KEY=$GEMINI_API_KEY
RUN npm run build

FROM public.ecr.aws/docker/library/nginx:alpine
COPY --from=builder /app/header-app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
