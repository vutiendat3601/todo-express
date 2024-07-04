FROM node:20-bookworm AS build
WORKDIR /app

COPY ./ ./
# RUN npm install
# RUN npm run build
RUN npm i -g @vercel/ncc
RUN npm i
RUN ncc build ./src/index.ts -o dist

FROM node:20-bookworm AS production
# WORKDIR /app
COPY --from=build /app/dist/ ./app

ENTRYPOINT ["tail", "-f", "/dev/null"]