# Stage 1: Build the application
FROM node:lts-alpine AS base

RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Build the application
RUN pnpm build


FROM base AS runner
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install wget for healthcheck
RUN apk add --no-cache wget

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 dcbot

RUN mkdir -p $PNPM_HOME && pnpm add -g prisma && chown -R dcbot:nodejs $PNPM_HOME

# Copy built application, pruned node_modules, and generated prisma client from builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

RUN chown -R dcbot:nodejs /app

USER dcbot

CMD [ "pnpm", "start" ]
