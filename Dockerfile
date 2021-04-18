FROM node:9 as builder
WORKDIR /usr/src/app
COPY . .
RUN npm install -g gulp --supress-warnings
RUN npm install --supress-warnings
ARG env_name
ENV NODE_ENV=$env_name
RUN gulp build

FROM node:9
COPY --from=builder /usr/src/app/dist /app
WORKDIR /app
RUN  npm install --supress-warnings
ARG env_name
ENV NODE_ENV=$env_name
ENV PORT=8080
EXPOSE 2500 8080
CMD [ "node", "." ]
