# aur-buildserver-next

This is a buildserver for the Archlinux User Repository (AUR) along with a web-interface to manage the builds.

Both server and web-interface are written in Typescript, the server uses express and the web-interface uses Next.js.

## Structure

- `backend/`: The server code. It is an express server along with a SQLite database accessed via Prisma. It also schedules build.
- `frontend/`: The web-interface code. It is a Next.js application using the app-directory structure. For UI components, it uses material-ui.

## Development

For convenience, there is a `docker-compose.yml` file that starts the server and the web-interface in development mode. To start the development environment, run:

```sh
docker-compose up
```

The web-interface will be available at `http://localhost:3000` and will route API requests to the server at `http://localhost:5768`.

## Deployment

Both the server and the web-interface can be deployed using the provided Dockerfiles. The Dockerfiles are located in the `backend/` and `frontend/` directories.

