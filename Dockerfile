# Use Node.js LTS 
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies (Force fresh install)
RUN npm install

# Copy source code
COPY . .

# Expose backend port
EXPOSE 4000

# Start command
CMD ["npm", "start"]
