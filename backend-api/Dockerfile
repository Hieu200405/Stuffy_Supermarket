FROM node:20-alpine AS builder
WORKDIR /app

# Copy shared configs and packages
COPY package*.json ./
COPY packages ./packages
COPY backend-api/package*.json ./backend-api/
COPY backend-api/tsconfig.json ./backend-api/
# Install root and backend-api dependencies
RUN npm install --workspace=backend-api --include-workspace-root

# Build the specific app
COPY backend-api ./backend-api
WORKDIR /app/backend-api
RUN npm run build

FROM node:20-alpine
WORKDIR /app
# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend-api/package*.json ./backend-api/
COPY --from=builder /app/backend-api/dist ./backend-api/dist

WORKDIR /app/backend-api
EXPOSE 5000
CMD ["node", "dist/server.js"]
