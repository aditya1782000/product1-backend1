FROM node:21.7.1

WORKDIR /saas-backend

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 4001

CMD ["npm", "run", "dev"]