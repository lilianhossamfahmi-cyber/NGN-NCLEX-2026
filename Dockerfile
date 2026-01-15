# Use Node.js LTS
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies (including dev for tsx)
RUN npm ci --include=dev

# Copy source code
COPY . .

# Expose backend port
EXPOSE 4000

# Start command
CMD ["npm", "start"]
