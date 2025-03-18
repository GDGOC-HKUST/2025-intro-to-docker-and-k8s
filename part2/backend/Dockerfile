# Use the official Go image
FROM golang:1.23

# Set the working directory inside the container
WORKDIR /app

# Copy the Go source code
COPY . .

# Build the Go application with static linking
RUN CGO_ENABLED=0 GOOS=linux go build -o ./gdg-docker-k8s-part2

# Expose the port
EXPOSE 8080

# Run the Go server
CMD ["./gdg-docker-k8s-part2"]
