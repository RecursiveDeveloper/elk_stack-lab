FROM node:latest

WORKDIR /opt/apollo-server

RUN npm init --yes && npm pkg set type="module" && \
    npm install @apollo/server graphql && \
    npm install --save-dev typescript @types/node && \
    npm install elastic-apm-node

COPY ./apollo-server/ ./

CMD [ "npm", "start" ]