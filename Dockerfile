# Base image
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install -g @angular/cli@18.2.0
RUN npm install

# Copy the Angular application code to the container
COPY . .

# Build the Angular application for production
ARG MyEnv
RUN ng build --configuration=$MyEnv

# Use a lightweight web server to serve the application
FROM nginx:alpine AS production

# Copy the Angular app build from the builder stage
COPY --from=builder /app/dist/hrprojectAdmin /usr/share/nginx/html

# Expose port 80 for the application
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]