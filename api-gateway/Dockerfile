FROM nginx:1.25-alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget -qO- http://localhost:80/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
