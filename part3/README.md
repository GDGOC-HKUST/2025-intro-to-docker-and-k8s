# Part 3: Introduction to Kubernetes

In this part, we'll learn how to deploy our containerized application to Kubernetes. We'll use [minikube](https://github.com/kubernetes/minikube) as our local Kubernetes cluster. Feel free to explore alternative like [kind](https://github.com/kubernetes-sigs/kind).

## Installing Minikube

Please follow the [Getting Started Guide](https://minikube.sigs.k8s.io/docs/start/?arch=%2Fmacos%2Fx86-64%2Fstable%2Fbinary+download) to setup the minikube singel cluster for your operating system.

You'll also need kubectl for interacting with the Kubenernetes cluster, install it by following the [instructions]().

## Steps

1. Build the Docker images (from part2 directory):
   ```bash
   cd ../part2
   docker compose build
   ```

2. Tag the images for Kubernetes:
   ```bash
   minikube -p minikube docker-env | source
   docker build -t docker-k8s-part2-frontend:latest ../part2/frontend
   docker build -t docker-k8s-part2-backend:latest ../part2/backend
   ```

3. Deploy the application to Kubernetes:
   ```bash
   kubectl apply -f deployment.yml
   ```

4. Check the deployment status:
   ```bash
   kubectl get deployments
   kubectl get pods
   kubectl get services
   kubectl get pvc
   ```

5. Access the application:
   ```bash
   minikube service frontend-service
   ```

## Understanding the Configuration

The `deployment.yml` file defines several Kubernetes resources:

### Deployments
1. **Frontend Deployment**
   - Serves the React application
   - Exposed via NodePort service
   - Uses the frontend image from part 2

2. **Backend Deployment**
   - Runs the Go backend service
   - Internal service (ClusterIP)
   - Connects to the database

3. **Database Deployment**
   - Runs PostgreSQL
   - Uses persistent storage
   - Internal service (ClusterIP)

### Services
1. **Frontend Service**
   - Type: NodePort
   - Exposes the frontend to external access
   - Port: 80

2. **Backend Service**
   - Type: ClusterIP
   - Internal service for backend communication
   - Port: 8080

3. **Database Service**
   - Type: ClusterIP
   - Internal service for database access
   - Port: 5432

### Storage
- **PersistentVolumeClaim**
  - Requests 1GB of storage
  - Used by the database for data persistence

## Cleanup

To clean up the resources:
```bash
kubectl delete -f deployment.yml
```

To stop Minikube:
```bash
minikube stop
```

## Next Steps

In part 4, we'll learn about scaling the application and monitoring its health using Prometheus and Grafana. 