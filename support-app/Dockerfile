FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY packages ./packages
COPY support-app/package*.json ./support-app/

RUN npm install --workspace=support-app --include-workspace-root

COPY support-app ./support-app
WORKDIR /app/support-app
RUN npx webpack --mode production

FROM nginx:alpine
COPY --from=builder /app/support-app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
