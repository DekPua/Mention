FROM node:21-alpine

WORKDIR /express

COPY . .

RUN npm install

RUN npm run build

CMD ["npm", "run", "start"]
