FROM node:20-alpine
WORKDIR /app
COPY image-service/package*.json ./
RUN npm install
COPY image-service .
RUN npm run build
EXPOSE 3009
CMD ["npm", "start"]
