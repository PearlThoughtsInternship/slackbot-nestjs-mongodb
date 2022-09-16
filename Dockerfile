FROM node:16.17.0-alpine3.15 AS development

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn add rimraf

RUN yarn --only=development

COPY . .

RUN yarn build

FROM node:16.17.0-alpine3.15 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

RUN chown node:node -R /usr/src/app/dist

USER node

CMD ["node", "dist/main"]