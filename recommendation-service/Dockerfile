FROM node:20-alpine
WORKDIR /app
COPY recommendation-service/package*.json ./
RUN npm install
COPY recommendation-service .
RUN npm run build
EXPOSE 3010
CMD ["npm", "start"]
