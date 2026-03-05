FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache git

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8081

CMD ["npx", "expo", "start", "--tunnel"]
