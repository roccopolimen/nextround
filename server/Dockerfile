FROM alpine:latest
RUN apk add --no-cache nodejs npm

WORKDIR /app-server

COPY . /app-server

RUN npm install

EXPOSE 4000

CMD ["npm", "start"]
