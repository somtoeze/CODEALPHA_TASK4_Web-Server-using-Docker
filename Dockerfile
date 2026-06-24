# Use Node.js lightweight image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY app/package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY app/ ./

# Create a non-root user for security
RUN adduser -D -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8081

# Health check – monitors container health
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run the application
CMD ["npm", "start"]