# FROM node:20.5.1 AS builder
FROM --platform=linux/amd64 node:20.5.1 AS builder
WORKDIR "/app"
COPY . .
RUN npm install
RUN npm install --prefix client
RUN npm run build --prefix client

# FROM node:20.5.1 AS production
FROM --platform=linux/amd64 node:20.5.1 AS production
WORKDIR "/app"
COPY --from=builder /app ./
CMD ["npm", "run", "start"]
# RUN nohup npm run start &
# RUN sleep 3
# CMD ["npm", "run", "test"]