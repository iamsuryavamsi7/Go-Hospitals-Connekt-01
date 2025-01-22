# Stage 1: Build the application
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app for production
RUN npm run build

# Stage 2: Serve the built application with HTTPS
FROM node:18-alpine

# Install 'serve' package globally
RUN npm install -g serve

# Install SSL libraries for Alpine
# RUN apk add --no-cache openssl

# Set the working directory
WORKDIR /app

# Copy the built app from the previous stage
COPY --from=build /app/dist ./dist

# EXPOSE 8080
EXPOSE 8080

# Command to serve the app with HTTPS
CMD ["serve", "-s", "dist", "-l", "8080"]