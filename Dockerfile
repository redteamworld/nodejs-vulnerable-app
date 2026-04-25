FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# install ping utility (command-injection)
RUN apk add --no-cache iputils

EXPOSE 3000 9229

CMD ["node", "--inspect=0.0.0.0:9229", "app.js"]