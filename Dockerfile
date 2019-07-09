FROM nginx

RUN rm -rf /usr/share/nginx/html/*

COPY test /usr/share/nginx/html

COPY /nginx-custom.conf /etc/nginx/conf.d/default.conf
