FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY . .

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

USER nodeuser

EXPOSE 3004

CMD ["npm", "start"]
