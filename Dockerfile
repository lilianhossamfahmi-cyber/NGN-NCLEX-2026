# Use Node.js LTS (non-alpine for native module support)
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose backend port
EXPOSE 4000

# Start command
CMD ["npm", "start"]
