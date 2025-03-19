# GDGOC-hkust-2025-intro-to-docker-and-k8s
Proposed Flow: From Docker to Kubernetes
1. Introduction to Docker: Deploying a Simple App Locally
Goal : Introduce the basics of containerization by deploying a simple application locally using Docker.
Content :
Explain what Docker is and why it’s useful.
Docker installation
https://docs.docker.com/get-started/get-docker/
Walk through creating a Dockerfile for a simple app (e.g., a Python Flask app or Node.js app).
https://github.com/railwayapp/nixpacks
Build and run the Docker container locally.
Show how to interact with the app via a browser or CLI.
Practical Example :
Create a basic "Hello World" web app (e.g., Flask or Node.js).
Write a Dockerfile to containerize the app.
Run the container locally and access the app via localhost.
Key Takeaways :
What is a container?
How to create a Dockerfile.
Running a container locally.

2. Docker Compose: Deploying Multiple Containers
Goal: Show how to manage multiple containers (e.g., an app and a database) using Docker Compose.
Content :
Introduce Docker Compose as a tool to manage multi-container setups.
Extend the previous example by adding a database (e.g., PostgreSQL or MySQL) to the app.
Write a docker-compose.yml file to define both the app and the database services.
Demonstrate how to start both services with a single command (docker-compose up).
Practical Example :
Extend the Flask/Node.js app to connect to a database.
Use Docker Compose to spin up both the app and the database.
Show how the app interacts with the database (e.g., storing and retrieving data).
Key Takeaways :
What is Docker Compose?
Managing multiple containers with a single configuration file.
Connecting services (e.g., app ↔ database).

3. Introduction to Kubernetes: Deploying Containers in a Cluster
Goal: Transition from Docker to Kubernetes by deploying the same app in a Kubernetes cluster.
Content :
Introduce Kubernetes as a container orchestration tool.
Explain basic Kubernetes concepts: Pods , Deployments , Services , and Namespaces .
https://kubernetes.io/docs/concepts/overview/components/

Deploy the same app (from Step 1) into a local Kubernetes cluster using Minikube or Kind (local Kubernetes clusters).
Minikube: 29.9k stars, Apache License 2.0
Kind: 13.8k stars, Apache License 2.0
Show how to expose the app using a Kubernetes Service (e.g., NodePort or LoadBalancer).
Practical Example :
Install Minikube or Kind on your local machine.
Create a Kubernetes Deployment YAML file for the app.
Apply the Deployment and expose it using a Service.
Access the app via the Kubernetes Service.
Key Takeaways :
What is Kubernetes and why is it useful?
Basic Kubernetes objects: Pods, Deployments, Services.
Deploying a containerized app in Kubernetes.

4. Scaling and Observability: Scaling the App and Monitoring Health
Goal: Show how Kubernetes can scale applications and monitor their health.
Content :
Scale the app horizontally by increasing the number of replicas in the Kubernetes Deployment.
Introduce observability tools like Prometheus and Grafana to monitor the app’s health and performance.
Show how to set up Prometheus to scrape metrics from the app and visualize them in Grafana.
Practical Example :
Scale the app to multiple replicas using kubectl scale.
Set up Prometheus to collect metrics from the app.
Visualize the metrics in Grafana (e.g., CPU usage, memory usage, request rates).
Key Takeaways :
Scaling applications in Kubernetes.
Monitoring app health and performance using Prometheus and Grafana.
Importance of observability in production environments.

5. CI/CD Pipeline Integration (Optional, Advanced)
Goal: Automate the deployment process using a CI/CD pipeline.
Content :
Introduce CI/CD as a way to automate the build, test, and deployment process.
Use a popular CI/CD tool like GitHub Actions, GitLab CI, or Jenkins to automate the deployment of the app to Kubernetes.
Show how code changes trigger automatic builds and deployments.
Practical Example :
Set up a GitHub Actions workflow to build the Docker image, push it to Docker Hub, and deploy it to Kubernetes.
Trigger the pipeline by pushing code changes to the repository.
Key Takeaways :
What is CI/CD and why is it important?
Automating deployments with GitHub Actions or GitLab CI.
Streamlining the development and deployment process.

Suggested Video Structure
Introduction (2-3 minutes) :
Briefly explain the journey from Docker to Kubernetes.
Outline the topics covered in the video.
Part 1: Docker Basics (5-7 minutes) :
Deploy a simple app locally using Docker.
Explain Dockerfile and container basics.
Part 2: Docker Compose (5-7 minutes) :
Extend the app with a database using Docker Compose.
Explain multi-container management.
Part 3: Kubernetes Basics (7-10 minutes) :
Deploy the app in a local Kubernetes cluster (Minikube/Kind).
Explain Kubernetes objects: Pods, Deployments, Services.
Part 4: Scaling and Observability (5-7 minutes) :
Scale the app and monitor it using Prometheus and Grafana.
Show how to visualize app metrics.
Conclusion (2-3 minutes) :
Recap the journey from Docker to Kubernetes.
Provide links to extra materials (GitHub repo, documentation).

Note: explaining concepts when we use this (to reduce coding workload)


Extra Materials to Include
GitHub Repository :
Code Snippets: Dockerfiles, docker-compose.yml, Kubernetes YAML files.
Notes: Step-by-step instructions for each part of the video.
Links: Links to Docker, Kubernetes, Prometheus, and Grafana documentation.
Video Description :
Link to the GitHub repository.
Links to relevant documentation (Docker, Kubernetes, Prometheus, Grafana).
Any additional resources (e.g., tutorials, guides).

Why This Flow Works
Progressive Complexity: Starts with simple Docker concepts and gradually introduces more complex Kubernetes features.
Hands-On Learning: Each section includes practical examples that viewers can follow along with.
Open Source Tools: Focuses on widely used, open-source tools like Docker, Kubernetes, Prometheus, and Grafana.
Engaging and Practical: Covers real-world use cases like deploying apps, managing databases, scaling, and monitoring.


Suggested timeline

After midterm (all coding materials done) - bare min, whatever is needed to record the videos]
Prepare recording materials (visuals, presentations, and scripts if needed) 
Start recording process	
Video editing iteration process (Wan & design team)
