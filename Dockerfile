FROM node
WORKDIR /src/src/app
COPY . .
RUN yarn install
EXPOSE 3001
CMD ["yarn", "start"]
