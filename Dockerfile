FROM node:18

RUN apt update && apt install -y tor

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 3000

CMD ["sh", "-c", "tor & npm start"]
