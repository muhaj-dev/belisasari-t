# ElizaOS Agents Dockerfile
FROM node:22-alpine

# Install build dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    gcc \
    libc-dev \
    linux-headers \
    pkgconfig \
    libusb-dev \
    eudev-dev

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY yarn.lock* ./

# Use yarn if yarn.lock exists, otherwise use npm
RUN if [ -f yarn.lock ]; then \
        yarn install --frozen-lockfile --production --legacy-peer-deps; \
    else \
        npm ci --omit=dev --legacy-peer-deps; \
    fi

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S elizaos -u 1001

# Change ownership
RUN chown -R elizaos:nodejs /app
USER elizaos

# Expose port (if needed)
EXPOSE 3001

# Start the application
CMD ["node", "phase2-orchestrator.js"]
