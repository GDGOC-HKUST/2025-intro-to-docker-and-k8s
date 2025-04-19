# Observability with Prometheus and Grafana: Part 4 - Interactive Script for GDG HKUST

## Script Overview

### Monitoring Architecture
```mermaid
graph TB
    subgraph Kubernetes[Kubernetes Cluster]
        subgraph Database[Database Deployment]
            DB[PostgreSQL Pod]
        end
        
        subgraph Exporters[Metric Exporters]
            PGE[Postgres Exporter Pod]
        end
        
        subgraph Monitoring[Monitoring Stack]
            Prom[Prometheus Pod]
            Graf[Grafana Pod]
        end
        
        PGCM[Postgres ConfigMap]
        PGPVC[Postgres PVC]
        PromCM[Prometheus ConfigMap]
        PromPVC[Prometheus PVC]
        GrafCM[Grafana ConfigMaps]
        GrafPVC[Grafana PVC]
        
        DB -->|Generates Metrics| PGE
        DB -->|Uses| PGPVC
        PGE -->|Exposes Metrics| Prom
        Prom -->|Scrapes Metrics| PGE
        Prom -->|Uses| PromCM
        Prom -->|Stores Data| PromPVC
        Graf -->|Queries Data| Prom
        Graf -->|Uses| GrafCM
        Graf -->|Stores Data| GrafPVC
        
        PGS[Postgres Service]
        PGES[Postgres Exporter Service]
        PromS[Prometheus Service]
        GrafS[Grafana Service]
        
        DB --> PGS
        PGE --> PGES
        Prom --> PromS
        Graf --> GrafS
        
        User((User)) -->|Access Dashboards| GrafS
        DevOps((DevOps)) -->|Query Metrics| PromS
    end
    
    classDef pod fill:#e1f5fe,stroke:#01579b
    classDef service fill:#e8f5e9,stroke:#2e7d32
    classDef config fill:#fff3e0,stroke:#ff6f00
    classDef storage fill:#ede7f6,stroke:#4527a0
    classDef external fill:#fce4ec,stroke:#880e4f
    
    class DB,PGE,Prom,Graf pod
    class PGS,PGES,PromS,GrafS service
    class PGCM,PromCM,GrafCM config
    class PGPVC,PromPVC,GrafPVC storage
    class User,DevOps external
```

### Deployment Process
```mermaid
sequenceDiagram
    participant D as Developer
    participant K as Kubernetes
    participant PG as PostgreSQL
    participant E as Exporter
    participant P as Prometheus
    participant G as Grafana
    
    D->>K: kubectl apply -f postgres.yml
    K->>PG: Create PVC
    K->>PG: Create Service
    K->>PG: Create Deployment
    
    D->>K: kubectl apply -f postgres-exporter.yml
    K->>E: Create Deployment
    K->>E: Create Service
    
    D->>K: kubectl apply -f prometheus.yml
    K->>P: Create ConfigMap
    K->>P: Create PVC
    K->>P: Create Deployment
    K->>P: Create Service
    
    D->>K: kubectl apply -f grafana.yml & grafana-configmap.yml
    K->>G: Create ConfigMaps
    K->>G: Create PVC
    K->>G: Create Deployment
    K->>G: Create Service
    
    Note over PG,G: All components deployed
    
    D->>K: minikube tunnel
    K-->>D: Services accessible
    
    E->>P: Metrics scraped
    P->>G: Data visualized
    
    D->>G: Access dashboards
    D->>P: Query metrics
```

### Summary
**Observability in Kubernetes: The Missing Piece for Production Readiness**

This tutorial bridges the gap between development and production-grade Kubernetes deployments by implementing comprehensive **observability** - the ability to understand what's happening inside your systems through collected data.

**What We'll Build:**
- A complete end-to-end monitoring stack for Kubernetes applications
- Real-time metrics collection from a PostgreSQL database
- Persistent, queryable time-series data storage 
- Beautiful, customizable dashboards to visualize performance

**Components We'll Deploy:**
1. **PostgreSQL Database**: Our application component generating performance metrics
2. **PostgreSQL Exporter**: Translates database metrics into Prometheus-readable format
3. **Prometheus**: The monitoring backbone that collects, stores, and processes metrics
4. **Grafana**: The visualization layer that transforms raw metrics into actionable insights

**Why This Matters:**
- Detect performance issues before they impact users
- Understand resource utilization for better scaling decisions
- Establish baselines for normal operation to detect anomalies
- Enable data-driven decisions for infrastructure optimization
- Build a foundation for alerts and automated responses

**Production Benefits:**
- Reduced mean-time-to-detection (MTTD) for issues
- Lower mean-time-to-resolution (MTTR) when problems occur
- Higher system reliability through proactive monitoring
- Better capacity planning based on historical trends
- Improved security through anomaly detection

By completing this tutorial, you'll understand not just how to deploy a monitoring stack, but how to interpret the collected metrics to make informed decisions about your applications running in Kubernetes.

### Duration
- **Total Time**: 10-12 minutes
- **Setup Time**: 15-20 minutes (pre-recording)
- **Scene Breakdown**:
  - Introduction: 30 seconds
  - Monitoring Stack Overview: 1 minute
  - Setting Up PostgreSQL: 1 minute
  - PostgreSQL Exporter: 1-2 minutes
  - Prometheus Configuration: 2 minutes
  - Grafana Setup: 2 minutes
  - Deploying the Stack: 1 minute
  - Exploring Prometheus: 1-2 minutes
  - Exploring Grafana: 1-2 minutes
  - Conclusion: 30 seconds

### Key Focus Areas
1. **Observability Fundamentals**
   - Metrics, monitoring, and visualization
   - Time-series data collection
   - Production monitoring best practices
   - Alerting and dashboard creation

2. **Prometheus Architecture**
   - Pull-based monitoring model
   - Metric collection and storage
   - PromQL query language basics
   - Target discovery and scraping

3. **Grafana Visualization**
   - Dashboard configuration
   - Data source integration
   - Metric visualization techniques
   - Dashboard sharing and exporting

4. **Kubernetes Integration**
   - ConfigMaps for configuration
   - Service discovery in Kubernetes
   - Persistent storage for monitoring data
   - Accessing monitoring services

### Learning Objectives
By the end of this tutorial, viewers will understand:
- The fundamental components of a Kubernetes monitoring stack
- How to collect and expose metrics from PostgreSQL
- How to configure Prometheus for metric collection
- How to set up Grafana for data visualization
- How to interpret database performance metrics
- Best practices for production monitoring
- How to extend the monitoring stack to other applications

## Pre-Recording Setup Instructions

[*VISUAL: Start with GDG HKUST logo animation fading into setup checklist*]

### Technical Setup
1. **Minikube & kubectl** - **ENSURE** Minikube and kubectl are properly installed
2. **Docker** - Docker **MUST** be running for Minikube with Docker driver
3. **Terminal Setup** - **USE** a clean terminal with increased font size (16-20pt) for better visibility
4. **Browser** - **HAVE** a web browser ready for viewing Prometheus and Grafana
5. **Text Editor/IDE** - **PREPARE** VS Code or your preferred editor with the project files open
6. **GDG Branding** - **INCLUDE** GDG HKUST logo and branding elements ready for overlays
7. **Demo Checkpoints** - **TEST** all commands beforehand to ensure smooth demonstration
8. **Resources** - **ALLOCATE** enough system resources (at least 4GB RAM allocated to Minikube)

### Recording Environment
1. **Clean Desktop** - **REMOVE** personal files, notifications, and set a neutral background
2. **Privacy Check** - **CLOSE** any sensitive information, emails, or personal apps
3. **Screen Resolution** - **SET** to 1920x1080 for optimal viewing
4. **Microphone Test** - **CHECK** audio quality before starting
5. **Do Not Disturb** - **ENABLE** Do Not Disturb mode to avoid notifications
6. **Rehearse Once** - **RUN** through the commands once before recording to ensure everything works
7. **Browser Tabs** - **PREPARE** browser tabs for Prometheus (localhost:9090) and Grafana (localhost:3000)

## Interactive Script for Observability

### [SCENE 1: Introduction] - 30 seconds
[*VISUAL: Smooth fade from GDG logo to split screen setup*]

[*TRANSITION: Use slide-in animation for terminal and editor windows*]

[*VISUAL: GDG HKUST logo should pulse briefly when mentioned*]

[**PRESENTER NOTE**: Start with energy and emphasize the importance of observability]

**YOU:** "Welcome back to our **GDG HKUST** Docker and Kubernetes series! 👋 

In our previous tutorial, we deployed our Todo application to Kubernetes. 

Today, we're adding a critical component for production systems: **Observability**! 🔍 

We'll set up **Prometheus** and **Grafana** to monitor a PostgreSQL database running in our Kubernetes cluster. 

This is essential knowledge for running reliable applications in production!" [*gesture: expansive motion showing monitoring importance*]

---

### [SCENE 2: Monitoring Stack Overview] - 1 minute
[*TRANSITION: Slide to clean screen with monitoring architecture diagram*]

[*VISUAL: Animated monitoring components appearing as mentioned*]

[**PRESENTER NOTE**: Use the analogy of a health monitoring system to make monitoring concepts relatable]

**YOU:** "Let's understand what makes up our monitoring stack. Think of it as a health monitoring system for your applications." [*gesture: overview motion*]

**YOU:** "Just like doctors use different instruments to check your health, our monitoring stack has specialized components:"

[*VISUAL: **SLIDES**: Each component appears with animation*]

**YOU:** "
1. **PostgreSQL Database** - This is our application component that we want to monitor. 
   - Think of it as the patient.

2. **PostgreSQL Exporter** - This component collects metrics from PostgreSQL and converts them to a format Prometheus understands. 
   - Like a nurse taking your vital signs.

3. **Prometheus** - This is our time-series database that collects and stores metrics. 
   - Think of it as the hospital's record-keeping system, tracking health metrics over time.

4. **Grafana** - This provides visualization of our metrics through dashboards. 
   - Like the doctor's displays showing heart rate, blood pressure, and other vital signs in an easy-to-understand format.

Let's set up these components to monitor our database!" [*gesture: transition motion*]

[**ENGAGEMENT QUESTION**: "Why do you think monitoring is considered essential for production systems?"]

---

### [SCENE 3: Setting Up PostgreSQL] - 1 minute
[*TRANSITION: Smooth pan to editor window*]

[*VISUAL: Editor showing postgres.yml with syntax highlighting*]

[**PRESENTER NOTE**: Explain how this database deployment differs from previous parts]

**YOU:** "First, let's examine our PostgreSQL deployment. This is a simplified version focused on monitoring rather than application support." [*gesture: pointing to file*]

*[**SHOW** postgres.yml]*

**YOU:** "This YAML file defines three Kubernetes resources:" [*gesture: counting*]

```yaml
# 1. Deployment - The PostgreSQL database server
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  # ...

# 2. Service - For internal communication
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
spec:
  type: ClusterIP
  # ...

# 3. PersistentVolumeClaim - For data persistence
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  # ...
```

**YOU:** "Note that we're using a **ClusterIP** service type, which means the database is only accessible from inside the cluster - a security best practice. 

We're also using a persistent volume claim for data storage, ensuring our data survives pod restarts." [*gesture: security and persistence motions*]

[**KNOWLEDGE CHECK**: "Our database is now defined, but how will we collect metrics from it? That's where the exporter comes in."]

---

### [SCENE 4: PostgreSQL Exporter] - 1-2 minutes
[*TRANSITION: Slide to next file*]

[*VISUAL: Editor showing postgres-exporter.yml*]

[**PRESENTER NOTE**: Explain the concept of exporters in the Prometheus ecosystem]

**YOU:** "Now we need a way to extract metrics from PostgreSQL and expose them in a format Prometheus can understand. For this, we use the **PostgreSQL Exporter**." [*gesture: extracting motion*]

*[**SHOW** postgres-exporter.yml]*

**YOU:** "Let's examine this exporter configuration:" [*gesture: examining motion*]

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres-exporter
spec:
  # ...
  template:
    # ...
    spec:
      containers:
        - name: postgres-exporter
          image: quay.io/prometheuscommunity/postgres-exporter:latest
          # ...
          env:
            - name: DATA_SOURCE_NAME
              value: "postgresql://postgres:postgres@postgres-service:5432/postgres?sslmode=disable"
```

**YOU:** "The key part is the **DATA_SOURCE_NAME** environment variable. This tells the exporter how to connect to our PostgreSQL database. 

Notice how it uses the service name `postgres-service` that we defined earlier - this is Kubernetes service discovery in action!" [*gesture: connection motion*]

**YOU:** "The exporter automatically collects hundreds of metrics from PostgreSQL, such as:
- Connection counts
- Transaction rates
- Query performance
- Buffer usage
- And much more

These metrics help us understand the health and performance of our database." [*gesture: metrics listing*]

**YOU:** "The exporter also needs its own service so Prometheus can find it:" [*gesture: pointing*]

```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres-exporter-service
spec:
  type: ClusterIP
  selector:
    app: postgres-exporter
  ports:
    - port: 9187
      targetPort: 9187
```

**YOU:** "This service exposes the exporter on port 9187, which is the standard port for the PostgreSQL exporter. 

Now Prometheus will be able to scrape metrics from this endpoint." [*gesture: endpoint motion*]

[**ENGAGEMENT QUESTION**: "Can you think of other databases or systems that might need specialized exporters?"]

---

### [SCENE 5: Prometheus Configuration] - 2 minutes
[*TRANSITION: Slide to next file*]

[*VISUAL: Editor showing prometheus.yml*]

[**PRESENTER NOTE**: Emphasize Prometheus' pull-based model and configuration approach]

**YOU:** "Now let's set up **Prometheus**, the backbone of our monitoring stack. 

Prometheus works by 'scraping' metrics from exporters at regular intervals." [*gesture: periodic scraping motion*]

*[**SHOW** prometheus.yml]*

**YOU:** "Our Prometheus configuration has four main parts:" [*gesture: counting motion*]

```yaml
# 1. Deployment - The Prometheus server
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
# ...

# 2. Service - For accessing the Prometheus UI
apiVersion: v1
kind: Service
metadata:
  name: prometheus-service
spec:
  type: LoadBalancer
# ...

# 3. PersistentVolumeClaim - For storing metrics
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: prometheus-pvc
# ...

# 4. ConfigMap - For Prometheus configuration
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    scrape_configs:
      - job_name: postgres
        static_configs:
          - targets: ["postgres-exporter-service:9187"]
```

**YOU:** "Let's focus on two crucial aspects:" [*gesture: focusing motion*]

**YOU:** "First, notice that the service type is **LoadBalancer**. This allows us to access the Prometheus web interface from outside the cluster, which is essential for monitoring. 

In a production environment, you might use an Ingress instead." [*gesture: external access motion*]

**YOU:** "Second, the **ConfigMap** contains the actual Prometheus configuration. The most important part is the `scrape_configs` section, which tells Prometheus what to monitor. 

Here, we're configuring Prometheus to scrape metrics from our PostgreSQL exporter at the address `postgres-exporter-service:9187`." [*gesture: configuration motion*]

**YOU:** "Prometheus will automatically discover this service within Kubernetes and start collecting metrics every 15 seconds by default. 

The metrics are stored in a time-series database on the persistent volume we defined." [*gesture: storage motion*]

[**KNOWLEDGE CHECK**: "Now Prometheus is configured to collect metrics, but we need a way to visualize them. That's where Grafana comes in."]

---

### [SCENE 6: Grafana Setup] - 2 minutes
[*TRANSITION: Slide to next file*]
[*VISUAL: Editor showing grafana.yml and a glimpse of grafana-configmap.yml*]

[**PRESENTER NOTE**: Explain Grafana's role in the monitoring ecosystem and how it integrates with Prometheus]

**YOU:** "Next up is **Grafana**, the visualization layer of our monitoring stack. 

Grafana creates beautiful dashboards from our Prometheus metrics." [*gesture: visualization motion*]

*[**SHOW** grafana.yml]*

**YOU:** "Like Prometheus, our Grafana setup consists of several parts:" [*gesture: listing motion*]

```yaml
# 1. Deployment with multiple volume mounts
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
spec:
  # ...
  template:
    # ...
    spec:
      containers:
        - name: grafana
          # ...
          volumeMounts:
            - name: grafana-storage
              mountPath: /var/lib/grafana
            - name: grafana-datasources
              mountPath: /etc/grafana/provisioning/datasources
            - name: grafana-dashboards-config
              mountPath: /etc/grafana/provisioning/dashboards
            - name: grafana-dashboards-storage
              mountPath: /var/lib/grafana/dashboards

# 2. Service - For accessing the Grafana UI
apiVersion: v1
kind: Service
metadata:
  name: grafana-service
spec:
  type: LoadBalancer
  # ...

# 3. PersistentVolumeClaim - For storing dashboards and settings
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: grafana-pvc
  # ...
```

**YOU:** "Notice the multiple **volumeMounts** in the Grafana container. 

These mount our ConfigMaps containing pre-configured dashboards and data sources." [*gesture: mounting motion*]

*[**SHOW** a glimpse of grafana-configmap.yml]*

**YOU:** "We're using ConfigMaps to provision Grafana automatically. This is a powerful feature that allows us to define dashboards as code - a DevOps best practice. 

Our ConfigMaps include:" [*gesture: code-based configuration*]

```yaml
# 1. Data Source Configuration - Connecting to Prometheus
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-datasources
data:
  dashboard.yml: |
    apiVersion: 1
    datasources:
      - name: Prometheus
        type: prometheus
        access: proxy
        url: http://prometheus-service:9090
        isDefault: true
        editable: true

# 2. Dashboard Provider Configuration
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-dashboards-config
  # ...

# 3. Pre-configured PostgreSQL Dashboard
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-dashboards-storage
  # ...
```

**YOU:** "The **grafana-datasources** ConfigMap automatically connects Grafana to our Prometheus server. 

Notice how it uses the Kubernetes service name `prometheus-service`." [*gesture: connection motion*]

**YOU:** "The **grafana-dashboards-storage** ConfigMap contains a pre-built dashboard for PostgreSQL metrics. 

This JSON definition is quite large, so we won't examine it in detail, but it includes panels for connections, transactions, query statistics, and more." [*gesture: dashboard components*]

**YOU:** "With this setup, Grafana will automatically be configured with a Prometheus data source and a PostgreSQL dashboard when it starts. 

No manual setup required!" [*gesture: automatic configuration*]

[**ENGAGEMENT QUESTION**: "What other systems might you want to create dashboards for in your applications?"]

---

### [SCENE 7: Deploying the Monitoring Stack] - 1 minute
[*TRANSITION: Pan to terminal window*]
[*VISUAL: Clean terminal with command prompt*]

[**PRESENTER NOTE**: Show the deployment process and explain what's happening behind the scenes]

**YOU:** "Now that we understand all the components, let's deploy our monitoring stack to Kubernetes!" [*gesture: deployment motion*]

*[**RUN COMMAND**]*
```
kubectl apply -f .
```

**YOU:** "This command applies all the YAML files in our directory, creating the PostgreSQL database, exporter, Prometheus, and Grafana resources. 

Let's check that everything is running:" [*gesture: checking motion*]

*[**RUN COMMAND**]*
```
kubectl get pods
```

**YOU:** "Let's check our services to see how we can access Prometheus and Grafana:" [*gesture: services check*]

*[**RUN COMMAND**]*
```
kubectl get services
```

**YOU:** "Notice that both the Prometheus and Grafana services are of type **LoadBalancer**. 

To access them locally with Minikube, we need to create a tunnel:" [*gesture: tunneling motion*]

*[**RUN COMMAND** in a new terminal window]*
```
minikube tunnel
```

**YOU:** "This command creates a network route so we can access our LoadBalancer services. 

Let's check the services again to see their external IPs:" [*gesture: IP check*]

*[**RUN COMMAND**]*
```
kubectl get services
```

**YOU:** "Now we should see external IPs for our services. 

Let's explore Prometheus and Grafana to see our monitoring in action!" [*gesture: transition to exploration*]

---

### [SCENE 8: Exploring Prometheus] - 1-2 minutes
[*TRANSITION: Smooth pan to browser window*]
[*VISUAL: Browser navigating to Prometheus UI*]

[**PRESENTER NOTE**: Give a quick tour of the Prometheus interface, focusing on key features]

**YOU:** "Let's first access Prometheus at **http://localhost:9090**. 

This is the Prometheus web interface, which allows us to query metrics and check the status of our monitoring targets." [*gesture: presenting UI*]

*[**NAVIGATE** to Status > Targets in the Prometheus UI]*

**YOU:** "Here in the **Targets** page, we can see that Prometheus is successfully scraping metrics from our PostgreSQL exporter. 

The state should show '**UP**', indicating that Prometheus can connect to the exporter and collect metrics." [*gesture: checking status*]

*[**NAVIGATE** to Graph in the Prometheus UI]*

**YOU:** "The **Graph** page allows us to query metrics using PromQL - the Prometheus Query Language. 

Let's try a simple query to see how many connections our PostgreSQL database has:" [*gesture: typing query*]

*[**TYPE** in the query box: pg_stat_activity_count]*

**YOU:** "When we execute this query, we can see the number of active connections to our PostgreSQL database over time. 

This is just one of hundreds of metrics available from the PostgreSQL exporter." [*gesture: showing results*]

**YOU:** "Prometheus is powerful for ad-hoc queries, but for regular monitoring, we typically use Grafana dashboards. 

Let's check those out next." [*gesture: transition motion*]

[**KNOWLEDGE CHECK**: "Prometheus gives us the ability to query raw metrics, but Grafana will provide a more user-friendly visualization of those metrics."]

---

### [SCENE 9: Exploring Grafana Dashboards] - 1-2 minutes
[*TRANSITION: Switch to Grafana tab in browser*]
[*VISUAL: Browser navigating to Grafana login page*]

[**PRESENTER NOTE**: Show the power of pre-configured dashboards and how they visualize the metrics]

**YOU:** "Now let's access Grafana at **http://localhost:3000**. 

The default login credentials are **admin/admin**. When you first log in, you'll be prompted to change the password, but for this demo, we can skip that." [*gesture: login motion*]

*[**LOGIN** to Grafana and navigate to Dashboards]*

**YOU:** "Thanks to our ConfigMap setup, Grafana already has a preconfigured dashboard for PostgreSQL. 

Let's check it out!" [*gesture: navigation motion*]

*[**NAVIGATE** to the PostgreSQL dashboard]*

**YOU:** "Here we can see a comprehensive dashboard with various metrics from our PostgreSQL database:" [*gesture: presenting dashboard*]

**YOU:** "The dashboard includes panels for:
- General database information like version and uptime
- Connection statistics
- Transaction rates and durations
- Query statistics
- Buffer usage and cache hit ratios
- And much more!

All of these metrics help us understand the performance and health of our database." [*gesture: pointing to different panels*]

**YOU:** "These visualizations make it easy to spot trends, anomalies, and potential issues. 

For example, a sudden increase in connection count might indicate a connection leak in your application, or high transaction durations might point to performance problems." [*gesture: analytical motion*]

**YOU:** "In a production environment, you would also set up alerts based on these metrics. 

For example, you might want to be notified if the database connection count exceeds 80% of the maximum allowed connections." [*gesture: alerting motion*]

[**ENGAGEMENT QUESTION**: "What metrics would you consider most important to monitor for your database applications?"]

---

### [SCENE 10: Conclusion] - 30 seconds
[*TRANSITION: Camera view with GDG branding*]
[*VISUAL: Monitoring dashboard with GDG HKUST elements*]

[**PRESENTER NOTE**: Summarize the key learnings and emphasize the importance of observability]

**YOU:** "And that's it! 🎉 We've successfully set up a complete monitoring stack for our Kubernetes application. 

We now have real-time visibility into our PostgreSQL database's performance and health - a critical capability for production systems." [*gesture: accomplished motion*]

**YOU:** "We covered how to:
- **Deploy** a PostgreSQL database in Kubernetes
- **Use** an exporter to collect metrics
- **Configure** Prometheus for metrics collection and storage
- **Set up** Grafana for visualization with pre-configured dashboards" [*gesture: summarizing motion*]

**YOU:** "Remember, observability is a crucial aspect of modern cloud-native applications. 

It helps you understand what's happening inside your systems, troubleshoot issues, and make data-driven decisions about scaling and optimization." [*gesture: importance motion*]

**YOU:** "For more advanced monitoring, check out the Prometheus and Grafana documentation, and consider using Helm charts like the Kube Prometheus Stack mentioned in the README." [*gesture: further learning*]

**YOU:** "Thank you for joining this **GDG HKUST** tutorial on Kubernetes observability! 👋 

Stay tuned for more cloud-native content!" [*gesture: friendly wave*]

[**FINAL KNOWLEDGE CHECK**: "Today we learned how to implement observability for Kubernetes applications, completing our journey from containerization with Docker to orchestration with Kubernetes to monitoring with Prometheus and Grafana."]

## Motion Instructions and Timing

- **Total Video Length**: Aim for 10-12 minutes
- **Pace**: Energetic but clear, maintain GDG professional enthusiasm

- **Motion Flow**: 
  - **USE** smooth GDG-branded transitions between scenes
  - **HIGHLIGHT** YAML with animated overlays
  - **DISPLAY** kubectl commands with visual emphasis
  - **EMPLOY** split-screen to show relationship between components
  - **UTILIZE** animated diagrams to show monitoring flow
  
- **Visual Aids**:
  - **MAINTAIN** GDG HKUST logo in corner throughout
  - **INCLUDE** monitoring architecture diagram with metrics flow
  - **OVERLAY** command cheatsheet during kubectl sections
  - **ANIMATE** metrics collection flow
  - **APPLY** success/completion animations at key milestones

- **Engagement Tips**:
  - **MAINTAIN** high energy appropriate for GDG presentations
  - **USE** emojis on screen to reinforce emotional points
  - **COMPARE** monitoring tools to healthcare concepts for relatability
  - **SHOW** genuine interest in the metrics and dashboards
  - **REFERENCE** the GDG community and the importance of monitoring in DevOps

## Visual Transition Guidelines

1. **Between Files**:
   - **USE** smooth sliding transitions
   - **MAINTAIN** 0.5s transition duration
   - **ADD** subtle blur effect during transition
   - **KEEP** file hierarchy visible in sidebar

2. **YAML to Browser**:
   - **IMPLEMENT** split screen with sliding animation
   - **HIGHLIGHT** relevant YAML before switching
   - **USE** browser fade-in effect
   - **KEEP** configuration visible with reduced opacity

3. **Prometheus to Grafana**:
   - **EMPLOY** dashboard visualization animations
   - **SHOW** data flow with animated lines
   - **HIGHLIGHT** metrics with pulse effect
   - **DISPLAY** graphs with loading animation

4. **Dashboard Navigation**:
   - **USE** smooth slide between dashboard panels
   - **APPLY** zoom-in animation for important metrics
   - **HIGHLIGHT** cursor for explanations
   - **IMPLEMENT** split screen for comparing related metrics

5. **Timing Guidelines**:
   - File transitions: **0.5s**
   - Browser fades: **0.3s**
   - YAML highlighting: **0.2s** per section
   - Dashboard animations: **0.7s**
   - Navigation transitions: **0.6s**

## Emphasis Guidelines

1. **Technical Terms** (use bold + higher pitch):
   - **Prometheus**
   - **Grafana**
   - **Observability**
   - **Metrics**
   - **Time-series**

2. **Key Concepts** (use italic + visual highlight):
   - **Monitoring**
   - **Visualization**
   - **Exporters**
   - **Dashboards**
   - **Alerts**

3. **GDG Elements** (use brand colors + enthusiasm):
   - **GDG HKUST**
   - **Community**
   - **DevOps practices**
   - **Cloud-native**

4. **Commands** (use code highlighting + typing animation):
   - **kubectl apply**
   - **kubectl get**
   - **minikube tunnel**
   - **Prometheus queries**
   - **Dashboard navigation**

5. **Success Moments** (use celebration animation + upbeat tone):
   - **Stack deployed**
   - **Metrics flowing**
   - **Dashboard loaded**
   - **Visualizations working**
   - **Complete monitoring system** 