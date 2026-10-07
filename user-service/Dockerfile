FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force
COPY . .
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 && \
    chown -R nodeuser:nodejs /app
USER nodeuser
EXPOSE 3005
CMD ["node", "index.js"]
