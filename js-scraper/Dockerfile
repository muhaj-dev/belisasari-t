# JS Scraper Service Dockerfile
FROM node:22-alpine

# Install Chrome dependencies and build tools
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    python3 \
    make \
    g++ \
    gcc \
    libc-dev \
    linux-headers \
    pkgconfig \
    libusb-dev \
    eudev-dev

# Tell Puppeteer to skip installing Chromium. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY yarn.lock* ./

# Use yarn if yarn.lock exists, otherwise use npm
RUN if [ -f yarn.lock ]; then \
        yarn install --frozen-lockfile --production --legacy-peer-deps; \
    else \
        npm install --omit=dev --legacy-peer-deps; \
    fi

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S scraper -u 1001

# Change ownership
RUN chown -R scraper:nodejs /app
USER scraper

# Expose port (if needed)
EXPOSE 3003

# Start the application
CMD ["node", "index.mjs"]
