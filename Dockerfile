FROM node:alpine
WORKDIR /usr/app

COPY package*.json /usr/src/
RUN npm install

# Bundle app source
COPY . .

EXPOSE 8000

CMD [ "node", "index.js" ]
