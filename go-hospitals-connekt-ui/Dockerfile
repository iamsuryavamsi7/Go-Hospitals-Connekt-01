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
RUN apk add --no-cache openssl

# Set the working directory
WORKDIR /app

# Copy the built app from the previous stage
COPY --from=build /app/dist ./dist

# Copy SSL certificates from Certbot and ensure permissions
COPY ./certs/fullchain.pem /etc/ssl/certs/fullchain.pem
COPY ./certs/privkey.pem /etc/ssl/private/privkey.pem

# Ensure the private key has the correct permissions
RUN chmod 600 /etc/ssl/private/privkey.pem
RUN chmod 644 /etc/ssl/certs/fullchain.pem

# Expose port 443 for HTTPS and 80 for HTTP (optional for redirection)
EXPOSE 443
EXPOSE 80

# Command to serve the app with HTTPS
CMD ["serve", "-s", "dist", "-l", "443", "--ssl-cert", "/etc/ssl/certs/fullchain.pem", "--ssl-key", "/etc/ssl/private/privkey.pem"]
