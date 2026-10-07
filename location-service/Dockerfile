FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY . .

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 && \
    chown -R nodeuser:nodejs /app
USER nodeuser

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:3002/health || exit 1

EXPOSE 3002

CMD ["node", "index.js"]
