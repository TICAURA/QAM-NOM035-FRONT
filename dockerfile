# stage 1
FROM node:16-alpine3.12 AS node
WORKDIR /app
COPY ./FrontEnd/package.json ./FrontEnd/package-lock.json ./
RUN npm install
COPY ./FrontEnd/ .
EXPOSE 4210
RUN npm run build

# stage 2
FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/dist/nom035-front /usr/share/nginx/html