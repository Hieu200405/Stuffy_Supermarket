FROM public.ecr.aws/docker/library/node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY packages ./packages
COPY marketing-app/package*.json ./marketing-app/

RUN npm install --workspace=marketing-app --include-workspace-root

COPY marketing-app ./marketing-app
WORKDIR /app/marketing-app
RUN npm run build

FROM public.ecr.aws/docker/library/nginx:alpine
COPY --from=builder /app/marketing-app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
