FROM node:20-bookworm AS build
WORKDIR /app

COPY ./ ./
RUN npm install
RUN npm run build

FROM node:20-bookworm AS production
WORKDIR /app
COPY --from=build /app/dist/* ./app

ENTRYPOINT [ "node /app" ]
