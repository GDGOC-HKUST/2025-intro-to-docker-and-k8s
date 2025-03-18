# Part 1

## What's Docker?

Docker is a tool that is used to automate the deployment of applications in lightweight containers so that applications can work efficiently in different environments in isolation.

> Taken from [Wikipedia](https://en.wikipedia.org/wiki/Docker_(software))

## Docker Installation

Install the Docker distributions for your specific operating systems by following the instructions on the [official website](https://docs.docker.com/get-started/get-docker/).

## Example Web Server

In part 1 of this series, we will be creating a simple web server that serves a single web page, in this case, using Go. The server is contained within the [main.go](main.go) file, it only does one job which is returning a single HTML page.

Even though it is easy to run this application using `go run main.go`, for more complicated applications or distributed systems that require reproducibility and stability, this might not be a good choice. In the past, virtual machines were used to handle these sort of tasks, nowadays, Docker was presented as a lightweight alternative of virtual machines.

## What's a Dockerfile?

A Dockerfile is a text file that contains a set of instructions for building a Docker image. It serves as a blueprint that defines how your application and its environment should be constructed. Each instruction in a Dockerfile creates a layer in the resulting image, which Docker caches to optimize future builds.

## Creating a Dockerfile

The explanations for individual lines are included as comments in the [Dockerfile](Dockerfile).

## Building an Image

After we defined how should we deploy our application, we have to package it into an image such that it can be distributed among other machines. We will explore the novel method of using `docker build`, and also `nixpacks` as an alternative approach.

- If using docker build, run `docker build -t docker-k8s-part1:latest .` in the current directory.
- If using nixpack, run `nixpacks build . --name docker-k8s-part1` in the current directory.

You should be able to find it under the image tab from Docker Desktop, or by running `docker image ls | grep docker-k8s-part1`.

## Starting the container

With the image in place, we will be able to run it using `docker run -it -p 8080:8080 docker-k8s-part1:latest`

If you are wondering about the difference between `EXPOSE` in Dockerfile and publish (`-p`) in the `docker run` command, please refer to the explanation given [here](https://stackoverflow.com/a/22150099).
