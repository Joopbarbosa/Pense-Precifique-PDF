FROM node:20-alpine

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    tini

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3001

# tini como PID 1 — sem init, os processos filhos do Chromium (crashpad handler, zygote) que o
# Node não é pai direto ficam órfãos e reparentados pro PID 1 depois de browser.close(); sem algo
# no PID 1 que faça wait() neles, viram zombie e se acumulam a cada requisição de PDF (confirmado
# via validação manual — `ps` mostrava STAT=Z crescendo a cada chamada de format=pdf).
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/index.js"]
