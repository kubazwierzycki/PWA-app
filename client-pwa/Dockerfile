FROM node:21-alpine
WORKDIR /app
COPY package.json .
RUN npm install
RUN npm i -g serve
COPY . .
RUN npm run build
EXPOSE 5137
CMD ["serve", "-s", "dist", "-l", "5137"]
