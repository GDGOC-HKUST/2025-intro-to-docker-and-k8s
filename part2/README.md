# Part 2: Deploying Multiple Applications using Docker Compose

In this part, we'll learn how to deploy multiple applications using Docker Compose, a tool that allows us to define and run multi-container Docker applications.

## What’s Docker Compose?

Docker Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services, then create and start all services with a single command.

## Docker Compose Installation

Docker Compose is included in Docker Desktop, so no separate installation is needed. For other setups, follow the [official installation guide](https://docs.docker.com/compose/install/).

## Example Project

Our example is a to-do list application with:
- A React frontend
- A Go backend using the Gin framework and GORM
- A PostgreSQL database

Docker eliminates deployment complexity by packaging each service as a standardized, self-contained unit that works consistently across environments.

## Docker Compose Specification

The `docker-compose.yml` file defines the services that make up your application, including configurations for images, ports, volumes, and dependencies.

## Running the Containers

To start the application, navigate to the directory containing the `docker-compose.yml` file and run:

```bash
docker-compose up --build
```

This command builds, (re)creates, starts, and attaches to containers for a service. To run them in the background, add the `-d` flag.

To stop the application, run:

```bash
docker-compose down
```

This command stops and removes the containers and networks defined in the docker-compose.yml file. To also remove the named volumes, add the `-v` flag.

> For the full list of available commands, please check out the [official documentation](https://docs.docker.com/reference/cli/docker/compose/).

## Accessing the Application

Once the application is running, you can access:

- Frontend at http://localhost:3000
- Backend API at http://localhost:8080
- Database at http://localhost:5432
