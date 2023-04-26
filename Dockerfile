FROM node:16.10.0
WORKDIR /app

RUN apt-get update 
RUN apt-get upgrade -y
RUN apt-get install -y python3-pip

COPY package.json /app
COPY python_requirements.txt /app

RUN pip3 install -r ./python_requirements.txt


ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
            then npm install; \
            else npm install --only=production; \
            fi




COPY . /app
CMD [ "npm","start" ]