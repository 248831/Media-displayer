# pull official base image
FROM node:13.12.0-alpine


# install app dependencies

COPY requirements.txt .

RUN apk update

RUN apk add bash

RUN apk add --no-cache --update \
    python3 python3-dev gcc \
    gfortran musl-dev
RUN apk add py-pip
RUN python3 -m ensurepip

RUN apk --no-cache add musl-dev linux-headers g++

RUN npm install --silent
RUN npm install -g serve --silent
RUN npm install react-scripts@3.4.1 -g --silent

RUN pip3 install -i https://pypi.clarin-pl.eu lpmn_client
RUN pip3 install -r ./requirements.txt

ADD Analizer .

EXPOSE 3000
CMD ["./Tutorial.sh", "sh"]



