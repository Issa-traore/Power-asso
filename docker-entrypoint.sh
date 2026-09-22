#!/bin/sh
set -e

echo "Applying database migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

echo "Starting server..."
exec node server.js
