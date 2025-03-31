#!/bin/bash

# Set Minikube's Docker environment
eval $(minikube docker-env)

# Build frontend with K8s-specific API URL
echo "================================================"
echo "Building frontend image..."
docker build -t docker-k8s-todo-frontend:latest ../part2/frontend

# Build backend
echo "================================================"
echo "Building backend image..."
docker build -t docker-k8s-todo-backend:latest ../part2/backend

# Verify images
echo "================================================"
echo "Verifying images..."
minikube image ls | grep docker-k8s-todo

echo "Build complete!"

# Deploy to Kubernetes
echo "================================================"
echo "Deploying to Kubernetes..."
kubectl apply -f backend.yml -f frontend.yml -f database.yml

# Wait for deployments to be ready
# echo "================================================"
# echo "Waiting for deployments to be ready..."
# kubectl wait    timeout=300s deployment/frontend
# kubectl wait --for=condition=available --timeout=300s deployment/backend
# kubectl wait --for=condition=available --timeout=300s deployment/db

echo "================================================"
echo "Starting Minikube tunnel in the background..."
echo "This will allow access to LoadBalancer services."
echo "You may be prompted for your password."
minikube tunnel

echo "================================================"
echo "Deployment complete! Your application should be accessible shortly."
echo "Use 'kubectl get services' to find the external IP addresses."