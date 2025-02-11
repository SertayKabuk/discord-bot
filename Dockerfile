# Stage 1: Build the application
FROM node:22-alpine AS build

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies (includes dev)
COPY package*.json ./
RUN npm ci

# Copy all files and build the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Remove dev dependencies so that only production deps remain
RUN npm prune --production

# Stage 2: Create the production image
FROM node:22-alpine

WORKDIR /usr/src/app

# Copy built application, pruned node_modules, and generated prisma client from build stage
COPY --from=build /usr/src/app/build ./build
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma

CMD [ "npm", "start" ]
