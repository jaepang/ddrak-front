FROM node:14.18.1
USER root
WORKDIR /ddrak-front
COPY . /ddrak-front
ARG API_URL
ENV REACT_APP_HOST_IP_ADDRESS $API_URL
RUN yarn
RUN yarn build