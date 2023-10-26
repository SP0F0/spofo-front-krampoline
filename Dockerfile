FROM krmp-d2hub-idock.9rum.cc/goorm/node:16
WORKDIR /usr/src/app
COPY spofo-front/ ./
RUN npm ci
RUN npm run build
RUN npm install -g serve
EXPOSE 5174
CMD ["serve", "build"]