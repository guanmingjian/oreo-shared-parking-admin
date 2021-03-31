FROM nginx:1.14.2
MAINTAINER Jam 1316560980@qq.com

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /etc/nginx/html
