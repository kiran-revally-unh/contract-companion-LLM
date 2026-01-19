FROM node:20-alpine

WORKDIR /app

# Install package manager (pnpm) and dependencies
COPY package.json pnpm-lock.yaml* package-lock.json* yarn.lock* ./
RUN npm i -g pnpm && \
    if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# Copy source and build
COPY . .
RUN if command -v pnpm >/dev/null 2>&1; then pnpm build; else npm run build; fi

ENV NODE_ENV=production
EXPOSE 3000

# Start Next.js server
CMD ["sh", "-c", "if command -v pnpm >/dev/null 2>&1; then pnpm start; else npm run start; fi"]