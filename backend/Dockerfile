FROM node:20.19.0-slim

WORKDIR /app

COPY package*.json .

COPY prisma ./prisma

RUN npm i

COPY . .

RUN npx prisma generate

RUN npm run build

RUN cp src/swagger.yaml dist/src/swagger.yaml

EXPOSE 3000

CMD [ "npm", "start" ]