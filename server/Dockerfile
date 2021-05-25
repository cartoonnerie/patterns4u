FROM node:latest

WORKDIR /server

COPY package*.json ./

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait && npm install

EXPOSE 8080
CMD  /wait && npm run start