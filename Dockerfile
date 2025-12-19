# Use Node.js LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy server package files specifically
COPY server/package*.json ./

# Install dependencies (including typescript for build)
RUN npm install

# Copy server source code
COPY server/ ./

# Build the server (compiles TS to JS)
RUN npm run build

# Expose the port Railway uses (defaults to 3000 or similar, but we bind 0.0.0.0)
EXPOSE 3001

# Start the server
CMD ["node", "dist/server.js"]
