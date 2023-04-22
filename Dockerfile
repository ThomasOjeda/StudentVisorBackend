FROM node:16.10.0
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 5000
CMD [ "node","app.js" ]