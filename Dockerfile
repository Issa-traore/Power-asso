# syntax=docker/dockerfile:1
#
# Debian-slim base rather than Alpine: its apt mirror proved reachable where
# Alpine's apk mirror was not in some sandboxed build environments used while
# validating this Dockerfile. Slim does NOT ship OpenSSL though, and `prisma
# generate` must run with the SAME OpenSSL version installed as the runner
# stage — otherwise it bundles the wrong query-engine binary and every query
# fails at runtime with "could not locate the Query Engine for runtime ...".

# ---- deps: install once, reused by the build stage ----
FROM node:24-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ---- builder: generate the Prisma client and build Next.js ----
FROM node:24-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- runner: minimal image that actually serves traffic ----
FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Must match the builder stage's OpenSSL — see the note at the top of this file.
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# The pruned standalone output deliberately excludes the `prisma` CLI (only the
# generated @prisma/client is traced in); install it separately, isolated from
# the app's runtime deps, just to run `prisma migrate deploy` on container start.
RUN npm install --no-save prisma@6.19.3

COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh \
  && mkdir -p public/uploads \
  && chown -R nextjs:nodejs /app

USER nextjs

ENV PORT=3000
EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
