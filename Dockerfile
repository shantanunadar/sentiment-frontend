# Use official Node.js Alpine base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy all source code
COPY . .

# Build the frontend for production
RUN npm run build

# Optional: Check what was built
RUN echo "=== Build output (dist) ===" && \
    find dist -type f \( -name "*.css" -o -name "*.js" -o -name "*.html" \) | head -10

# Expose port for preview server
EXPOSE 3000

# Run Vite's preview server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
