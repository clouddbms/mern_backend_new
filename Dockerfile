# Use the official Node.js 14 image as a base
FROM node:18.16.0-alpine3.17

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application with Nodemon
CMD ["npx", "nodemon", "server.js"]
