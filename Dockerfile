
# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the new nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 and start nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
