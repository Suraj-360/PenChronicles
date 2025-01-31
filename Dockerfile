# Step 1: Base image (node 18 for React)
FROM node:18-alpine AS build

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 4: Copy all files and build the app
COPY . .
RUN npm run build

# Step 5: Use nginx to serve the build
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose Port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
