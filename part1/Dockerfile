# Use the official Go image
FROM golang:1.21.6

# Set the working directory inside the container
WORKDIR /app

# Copy the Go source code
COPY . .

# Build the Go application with static linking
RUN CGO_ENABLED=0 GOOS=linux go build -o ./server

# Expose the port
EXPOSE 8080

# Run the Go server
CMD ["./server"]
