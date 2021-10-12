FROM node:14.16.1

WORKDIR /app
COPY package.json /app/
COPY package-lock.json /app/
RUN npm config set registry http://registry.npmjs.org/
RUN npm install
COPY ./ /app/
ARG env=develop
RUN npm run build-develop

CMD [ "npm", "run", "start-develop" ]
