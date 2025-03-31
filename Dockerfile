FROM node:20

# Set working directory early
WORKDIR /home/app

# Copy the source code into the container
COPY . .

# Install dependencies (using npm ci if you have a lockfile)
RUN npm install

# Build the application
RUN npm run build

# Change to the directory where main.js is located
WORKDIR /home/app/dist/src

# Start the application
CMD ["node", "main.js"]
