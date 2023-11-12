# Use the official Node.js image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose port 8080
EXPOSE 8080

# Start the application
CMD ["npm", "start"]