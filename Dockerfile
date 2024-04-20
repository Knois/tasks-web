# pull official base image
#FROM node:16.16.0-alpine

# set working directory
#WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
#COPY package.json ./
#COPY package-lock.json ./
#RUN npm install --silent

# add app
#COPY . ./

# start app
#CMD ["npm", "run build"]

# stage1 - build react app first
FROM node:18.18.2-slim AS build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json /app/
COPY ./package-lock.json /app/
RUN npm install
COPY . /app
RUN npm run build

# stage 2 - build the final image and copy the react build files
FROM nginx:1.17.8-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]