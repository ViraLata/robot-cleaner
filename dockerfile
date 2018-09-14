FROM node:8

# Create app directory

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

ENTRYPOINT ["node", "index.js"]

