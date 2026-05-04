FROM nginx:alpine

RUN apk add --no-cache openssl \
    && mkdir -p /etc/nginx/ssl_SRS \
    && openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl_SRS/key.pem \
        -out /etc/nginx/ssl_SRS/cert.pem \
        -subj "/CN=localhost/O=Dev/C=ES"

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443
