# Use the official Node.js image as the base
FROM node:22.12.0 as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install -g @angular/cli@18.2.0 \
    && npm install

# Copy the Angular application code to the container
COPY . .

# Build the Angular application for production
RUN ng build --configuration=production

# Use a lightweight web server to serve the application
FROM nginx:stable-alpine

# Copy the Angular app build from the builder stage
COPY --from=builder /app/dist/<your-angular-project-name> /usr/share/nginx/html

# Expose port 80 for the application
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]