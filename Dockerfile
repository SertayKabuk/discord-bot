# Stage 1: Build the application
FROM --platform=linux/arm64 node:22-alpine AS build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force && npm install -g typescript

# Copy all files and build the application
COPY . .
RUN npm run build

# Stage 2: Create the production image
FROM --platform=linux/arm64 node:22-alpine

# Create app directory
WORKDIR /usr/src/app
RUN mkdir /usr/src/app/output

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app/build /usr/src/app/build
COPY --from=build /usr/src/app/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

CMD [ "npm", "start"]
