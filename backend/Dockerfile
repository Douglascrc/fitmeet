FROM node:20.19.0-slim

WORKDIR /app

COPY package*.json .

COPY prisma ./prisma

RUN npm i

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD [ "sh", "-c", "\
    npx prisma migrate deploy && \
    npx prisma db seed && \
    npm run init-bucket && \
    npm start\
  " ]