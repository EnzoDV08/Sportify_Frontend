# ------------------------
# Base image with Node
# ------------------------
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the Vite project (this will output to dist/)
RUN npm run build

# OPTIONAL: Package Electron app (comment if only running Vite in dev)
# RUN npm run electron:build

# ------------------------
# Run the Electron app
# ------------------------
CMD ["npm", "run", "electron"]
