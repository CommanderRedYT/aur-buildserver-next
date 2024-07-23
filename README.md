# aur-buildserver-next

This is a buildserver for the Archlinux User Repository (AUR) along with a web-interface to manage the builds.

Both server and web-interface are written in Typescript, the server uses express and the web-interface uses Next.js.

The dependency resolution is a bit hacky. I fetch the dependencies from the AUR and add them in the database.
Build processes may only start when all dependencies are built. This means, if you start a job to build all packages,
eventually all packages will be built.

## Features

- Build packages from the AUR
- Automatically build packages when they are updated
- Sign packages with GPG
- Web-interface to manage builds

## Future Ideas

- I might rewrite it one day to use systemd-nspawn. This would mean actual clean and isolated builds, while not requiring Docker-in-Docker.

## Structure

- `backend/`: The server code. It is an express server along with a SQLite database accessed via Prisma. It also schedules build.
- `frontend/`: The web-interface code. It is a Next.js application using the app-directory structure. For UI components, it uses material-ui.

## Development

For convenience, there is a `docker-compose.yml` file that starts the server and the web-interface in development mode. To start the development environment, run:

```sh
docker-compose up
```

The web-interface will be available at `http://localhost:3042` and will route API requests to the server at `http://localhost:5768`.

## Deployment

Both the server and the web-interface can be deployed using the provided Dockerfiles. The Dockerfiles are located in the `backend/` and `frontend/` directories.

