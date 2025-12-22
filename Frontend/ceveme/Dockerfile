FROM node:22-alpine AS builder
WORKDIR /build/ceveme

COPY package.json package-lock.json* ./
RUN npm ci --silent
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_GFONTS_API_KEY
ENV VITE_GFONTS_API_KEY=$VITE_GFONTS_API_KEY

RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app/ceveme
RUN npm install -g serve

COPY --from=builder /build/ceveme/dist ./dist

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup && \
    chown -R appuser:appgroup /app/ceveme
    
USER appuser
EXPOSE 3001

CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:3001"]