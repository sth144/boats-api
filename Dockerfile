FROM node:8
RUN npm install -g typescript@latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN tsc -p .
ENV PORT=8080
ENV GOOGLE_APPLICATION_CREDENTIALS=./hindss-assign8-57b9d193bf8d.json
EXPOSE ${PORT}
CMD ["npm", "start"]
#CMD ["bash"]