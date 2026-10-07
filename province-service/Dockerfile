FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copy source
COPY . .

# Non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001
USER nodeuser

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:3001/health || exit 1

EXPOSE 3001

CMD ["node", "index.js"]
