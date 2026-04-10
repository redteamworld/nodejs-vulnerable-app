FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# install ping utility (command-injection)
RUN apk add --no-cache iputils

EXPOSE 3000

CMD ["node", "app.js"]