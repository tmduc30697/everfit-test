# Everfit Test

- install all dependencies:
  ```
  yarn install
  ```

- Create a docker container for the database server of this project
  ```
  docker run -p 3006:3006 --name everfit -e MYSQL_ROOT_PASSWORD=admin -d mysql:8
  ```

- copy `.env` file and configure your database url
  ```
  cp .env.example .env
  ```

- run prisma migration
  ```
  yarn migrate
  ```

- start server
  ```
  yarn dev
  ```
