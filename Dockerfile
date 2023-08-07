FROM node:alpine
WORKDIR /usr/src/app

COPY /usr/src/app/package* ./
RUN npm install

# Bundle app source
COPY . .

EXPOSE 8000

CMD [ "node", "index.js" ]
