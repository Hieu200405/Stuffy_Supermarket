FROM node:18-alpine

WORKDIR /app

COPY graphql-gateway/package*.json ./
RUN npm install
COPY graphql-gateway .
RUN npm run build
EXPOSE 4000
CMD ["node", "dist/server.js"]
