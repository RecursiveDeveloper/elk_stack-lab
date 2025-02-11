FROM node:latest

WORKDIR /opt/apollo-server

RUN npm init --yes && npm pkg set type="module" && \
    npm install @apollo/server graphql && \
    npm install --save-dev typescript @types/node

COPY ./apollo-server/ ./

CMD [ "npm", "start" ]