FROM public.ecr.aws/docker/library/node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY packages ./packages
COPY profile-app/package*.json ./profile-app/

RUN npm install --workspace=profile-app --include-workspace-root

COPY profile-app ./profile-app
WORKDIR /app/profile-app
RUN npm run build

FROM public.ecr.aws/docker/library/nginx:alpine
COPY --from=builder /app/profile-app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
