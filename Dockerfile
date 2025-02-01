# Stage 1: Build the application
FROM --platform=linux/arm64 node:22-alpine AS build

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies (includes dev)
COPY package*.json ./
RUN npm ci

# Copy all files and build the application
COPY . .
RUN npm run build

# Remove dev dependencies so that only production deps remain
RUN npm prune --production

# Stage 2: Create the production image
FROM --platform=linux/arm64 node:22-alpine

WORKDIR /usr/src/app

# Copy built application and pruned node_modules from build stage
COPY --from=build /usr/src/app/build ./build
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./

CMD [ "npm", "start" ]
