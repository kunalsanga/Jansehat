FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG VITE_GEMINI_API_KEY=your_gemini_api_key_here
ARG VITE_API_BASE_URL=http://localhost:3001
ARG GEMINI_API_KEY=your_gemini_api_key_here
ENV VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV GEMINI_API_KEY=${GEMINI_API_KEY}
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
ENV FRONTEND_PORT=4173
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY server.js .
COPY vite.config.js .
EXPOSE 3001 4173
CMD ["sh", "-c", "npm run server & npm run preview -- --host 0.0.0.0 --port ${FRONTEND_PORT}"]

