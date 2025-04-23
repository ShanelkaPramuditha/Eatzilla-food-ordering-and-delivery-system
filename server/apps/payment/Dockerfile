# Base image with pnpm setup
FROM node:lts-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /usr/src/app

# Install dependencies separately for better caching
FROM base AS dependencies
COPY ../../pnpm-lock.yaml ../../package.json ./
RUN pnpm install --frozen-lockfile

# Development stage (includes dev dependencies)
FROM dependencies AS development
COPY . .
RUN pnpm run build

# Production stage (only production dependencies)
FROM base AS production
COPY ../../pnpm-lock.yaml ../../package.json ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=development /usr/src/app/dist ./dist

# Final runtime image
FROM node:lts-alpine AS runner
WORKDIR /usr/src/app
COPY --from=production /usr/src/app/node_modules ./node_modules
COPY --from=production /usr/src/app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/apps/payment/main.js"]