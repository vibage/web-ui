# Use an official Python runtime as a parent image
FROM node:10

# Set the working directory to /app
WORKDIR /app/front

# Copy the current directory contents into the container at /app
COPY . /app/front

RUN yarn install

RUN yarn build:prod

WORKDIR /app/dist/front-end

EXPOSE 4200

CMD ["angular-http-server", "-p", "80"];