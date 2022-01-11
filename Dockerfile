FROM node:14.18.1
USER root
WORKDIR /ddrak-front
COPY . /ddrak-front
ARG API_URL
ENV REACT_APP_HOST_IP_ADDRESS $API_URL
ENV GENERATE_SOURCEMAP false
RUN yarn
RUN NODE_OPTIONS="--max-old-space-size=8192" yarn build