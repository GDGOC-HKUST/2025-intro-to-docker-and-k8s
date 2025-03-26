# Part 1: Deploying an Application using Docker

In this part, we will cover the basics of Docker, including its installation, creating a simple web server, writing a Dockerfile, building a Docker image, and running a Docker container.

## What's Docker?

Docker is a tool that is used to automate the deployment of applications in lightweight containers so that applications can work efficiently in different environments in isolation.

> The above paragraph is taken from [Wikipedia](https://en.wikipedia.org/wiki/Docker_(software))

## Docker Installation

Install the Docker distributions for your specific operating systems by following the instructions on the [official website](https://docs.docker.com/get-started/get-docker/).

## Example Web Server

In part 1 of this series, we will be creating a simple web server that serves a single web page, in this case, using Go. The server is contained within the [main.go](main.go) file, it only does one job which is returning a HTML page.

Even though it is easy to run this application using `go run main.go`, for more complicated applications or distributed systems that require reproducibility and stability, this might not be a good choice. In the past, virtual machines were used to handle these sort of tasks, nowadays, Docker is as a lightweight alternative of virtual machines.

## What's a Dockerfile?

You might have already noticed part 1 includes a [Dockerfile](Dockerfile) with explanations for individual lines included as comments.

A Dockerfile is a text file that contains a set of instructions for building a Docker image. It serves as a blueprint that defines how your application and its environment should be constructed. Each instruction in a Dockerfile creates a layer in the resulting image, which Docker caches to optimize future builds.

## Building the Image

After defining how our application should be created, we have to package it into an image such that it can be distributed among other machines. Here we will explore the basic method of using `docker build`.

For using `docker build`, run `docker build -t docker-k8s-part1 .` in the `part1` directory.

Note that the `-t` flag specify what should be the tag of the image, we can then reference the image using this tag. For Docker Desktop, you can find it under the image tab, or for the Docker CLI, you can run `docker image ls` to view all images. More about the naming scheme of tag [here](https://docs.docker.com/get-started/docker-concepts/building-images/build-tag-and-publish-an-image/#tagging-images).

> If writing a Dockerfile feels too cumbersome, you can use [`nixpacks`](https://github.com/railwayapp/nixpacks), a tool that simplifies Docker image creation by automatically detecting your app’s requirements. Without needing a Dockerfile, simply run `nixpacks build . --name docker-k8s-part1` to build your image.

## Running the Container

With the image in place, we will be able to run it using `docker run -it -p 8080:8080 docker-k8s-part1:latest`. Where `-it` opens an interactive shell for the container, and `-p` publish the port `8080` for the container. Again, you can find the container under the "Containers" tab from Docker Desktop, or by running `docker ps`

> If you are wondering about the difference between `EXPOSE` in Dockerfile and publish (`-p`) in the `docker run` command, please refer to the explanations given [here](https://stackoverflow.com/a/22150099). In brief, `EXPOSE` documents intent, while -p actually binds the port.
