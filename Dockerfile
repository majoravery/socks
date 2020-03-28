ARG ALPINE_VERSION=3.10

# Server
FROM node:10.16.3-alpine as server

WORKDIR /usr/app/server

COPY ./server/package.json ./
RUN yarn install

COPY ./server .

# Client
FROM node:10.16.3-alpine as client

WORKDIR /usr/app/client

COPY ./client/package.json ./
RUN yarn install

COPY ./client .

ENV NODE_ENV=production
RUN yarn build

# Final image
FROM alpine:3.10

RUN apk add --update runit nodejs yarn haproxy && \ 
    rm -rf /var/cache/apk/*

COPY etc/service  /etc/service
COPY etc/haproxy  /etc/haproxy

COPY --from=server /usr/app/server /usr/app/server
COPY --from=client /usr/app/client /usr/app/client

EXPOSE 3051
ENTRYPOINT ["/sbin/runsvdir", "/etc/service"]