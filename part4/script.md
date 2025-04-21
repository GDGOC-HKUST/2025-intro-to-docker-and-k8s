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

[**PRESENTER NOTE**: Assume familiarity with Deployment, Service, PVC from Part 3. Focus on *why* we need these for this specific component.]

**YOU:** "First, let's set up our PostgreSQL database. This deployment is similar to the database we used in Part 3, but focused just on providing a target for monitoring." [*gesture: familiar setup*]

*[**SHOW** postgres.yml]*

**YOU:** "Like before, we define a **Deployment** to run the PostgreSQL container, a **PersistentVolumeClaim** (PVC) for data storage (remember from Part 3 how this keeps data safe?), and a **Service** for internal networking." [*gesture: recalling components*]

**YOU:** "The key difference here is the Service type and name:"

```yaml
# postgres.yml (Service Snippet)
apiVersion: v1
kind: Service
metadata:
  name: postgres-service # Important: Exporter will use this name
spec:
  ports:
  - port: 5432
    targetPort: 5432
  selector:
    app: postgres
  type: ClusterIP      # Recall from Part 3: Only accessible *inside* the cluster
```

**YOU:** "We're using `type: ClusterIP`, making it accessible only *within* the cluster, which is good practice for databases. The name `postgres-service` is crucial because our metrics exporter will use this name to connect to the database." [*gesture: pointing to name*]

[**KNOWLEDGE CHECK**: "We have our database running internally. How do we get metrics *out*?"]

---

### [SCENE 4: PostgreSQL Exporter] - 1-2 minutes
[*TRANSITION: Slide to next file*]
[*VISUAL: Editor showing postgres-exporter.yml*]

[**PRESENTER NOTE**: Explain the specific role of this exporter and its configuration.]

**YOU:** "To get metrics from PostgreSQL into Prometheus, we need a translator – that's the **PostgreSQL Exporter**. It queries PostgreSQL for metrics and exposes them in a format Prometheus understands." [*gesture: translating motion*]

*[**SHOW** postgres-exporter.yml]*

**YOU:** "This requires its own **Deployment** to run the exporter container and a **Service** so Prometheus can find and 'scrape' it."

**YOU:** "The most critical part of the Deployment configuration is telling the exporter how to find our database:"

```yaml
# postgres-exporter.yml (Deployment Env Snippet)
# ... inside containers: section ...
          env:
            - name: DATA_SOURCE_NAME
              # Tells exporter how to connect to the DB:
              # Format: postgresql://<user>:<password>@<host>:<port>/<database>?sslmode=disable
              value: "postgresql://postgres:postgres@postgres-service:5432/postgres?sslmode=disable"
              #                                       ^ Uses the DB Service name!
```

**YOU:** "See how `DATA_SOURCE_NAME` uses the **Service name** `postgres-service` we just defined? That's Kubernetes service discovery linking our exporter to the database!" [*gesture: connection motion*]

**YOU:** "Now, we define the **Service** for the exporter itself, so Prometheus knows where to find *it*:"

```yaml
# postgres-exporter.yml (Service Snippet)
apiVersion: v1
kind: Service
metadata:
  name: postgres-exporter-service # Prometheus will target this name
spec:
  selector:
    app: postgres-exporter
  ports:
    - port: 9187          # Standard port for postgres-exporter
      targetPort: 9187    # Port the exporter container listens on
  type: ClusterIP         # Prometheus runs inside the cluster
```

**YOU:** "Prometheus will connect to `postgres-exporter-service` on port `9187` to scrape the metrics. We use ClusterIP because Prometheus also runs inside the cluster." [*gesture: endpoint motion*]

[**ENGAGEMENT QUESTION**: "Exporters are common in Prometheus. What other services might have dedicated exporters? (e.g., Redis, Kafka, web servers)"]

---

### [SCENE 5: Prometheus Configuration] - 2 minutes
[*TRANSITION: Slide to next file*]
[*VISUAL: Editor showing prometheus.yml*]

[**PRESENTER NOTE**: Assume K8s object familiarity. Focus on Prometheus config via ConfigMap.]

**YOU:** "Next: **Prometheus**, the core of our stack. It pulls (or 'scrapes') metrics from targets like our exporter and stores them as time-series data." [*gesture: core component + scraping motion*]

*[**SHOW** prometheus.yml]*

**YOU:** "To run Prometheus in Kubernetes, we need:" [*gesture: listing K8s objects*]
"- A **Deployment** to run the Prometheus server container.
- A **PVC** to store the collected metrics persistently (like in Part 3).
- A **Service** to access the Prometheus web UI.
- A **ConfigMap** to provide Prometheus' *own* configuration."

**YOU:** "Let's look at the Service and the ConfigMap."

```yaml
# prometheus.yml (Service Snippet)
apiVersion: v1
kind: Service
metadata:
  name: prometheus-service # Grafana will use this name
spec:
  selector:
    app: prometheus
  ports:
    - port: 9090
      targetPort: 9090
  type: LoadBalancer     # Recall Part 3: Makes UI accessible externally
                         # (Needs 'minikube tunnel')
```

**YOU:** "We use `type: LoadBalancer` here, just like our frontend/backend in Part 3, so we can access the Prometheus web UI externally via `minikube tunnel`." [*gesture: external access motion*]

**YOU:** "The **ConfigMap** tells Prometheus *what* to monitor:"

```yaml
# prometheus.yml (ConfigMap Snippet - Scrape Config)
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s # How often to scrape targets

    scrape_configs:
      - job_name: 'prometheus' # Job to scrape Prometheus itself
        static_configs:
          - targets: ['localhost:9090']

      - job_name: 'postgres' # Job for our database exporter
        static_configs:
          # Tells Prometheus where the exporter Service is:
          - targets: ["postgres-exporter-service:9187"]
          #             ^ Uses the exporter Service name and port!
```

**YOU:** "Inside the `scrape_configs`, we define a `job_name` called 'postgres'. The `targets` list tells Prometheus to connect to our exporter using its Service name, `postgres-exporter-service`, on port `9187`. Prometheus will now automatically find and scrape metrics from our exporter!" [*gesture: configuration + success motion*]

[**KNOWLEDGE CHECK**: "Prometheus is set to collect data. How do we make sense of it? Grafana!"]

---

### [SCENE 6: Grafana Setup] - 2 minutes
[*TRANSITION: Slide to next file*]
[*VISUAL: Editor showing grafana.yml and a glimpse of grafana-configmap.yml*]

[**PRESENTER NOTE**: Focus on Grafana's role and config provisioning via ConfigMaps.]

**YOU:** "Finally, **Grafana**! This takes the raw time-series data from Prometheus and turns it into beautiful, insightful dashboards." [*gesture: visualization motion*]

*[**SHOW** grafana.yml]*

**YOU:** "Grafana also needs standard Kubernetes resources:" [*gesture: listing K8s objects*]
"- A **Deployment** to run the Grafana server.
- A **PVC** to store its configuration and custom dashboards persistently.
- A **Service** to access the Grafana web UI.
- And crucially, **ConfigMaps** to automatically provision datasources and dashboards."

**YOU:** "The Service is again `type: LoadBalancer` for external access:"

```yaml
# grafana.yml (Service Snippet)
apiVersion: v1
kind: Service
metadata:
  name: grafana-service
spec:
  selector:
    app: grafana
  ports:
    - port: 3000
      targetPort: 3000
  type: LoadBalancer # Recall Part 3: External access via 'minikube tunnel'
```

**YOU:** "The power lies in using ConfigMaps for automatic setup. The Deployment mounts these ConfigMaps as volumes:"

```yaml
# grafana.yml (Deployment Snippet - Volume Mounts)
# ... inside containers: section ...
          volumeMounts:
            - name: grafana-storage # For Grafana's internal state
              mountPath: /var/lib/grafana
            # These mount ConfigMaps for provisioning:
            - name: grafana-datasources        # Mounts the datasource config
              mountPath: /etc/grafana/provisioning/datasources
              readOnly: true
            - name: grafana-dashboards-config # Mounts the dashboard provider config
              mountPath: /etc/grafana/provisioning/dashboards
              readOnly: true
            - name: grafana-dashboards-storage # Mounts the actual dashboard JSON
              mountPath: /var/lib/grafana/dashboards/postgres
              readOnly: true
# ... below, volumes: section links names (e.g., grafana-datasources) to ConfigMaps ...
```

**YOU:** "Let's glance at the key ConfigMap that connects Grafana to Prometheus:"

*[**SHOW** a glimpse of grafana-configmap.yml - Datasource part]*

```yaml
# grafana-configmap.yml (Datasource ConfigMap Snippet)
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-datasources
data:
  datasources.yml: |  # Renamed key for clarity
    apiVersion: 1
    datasources:
    - name: Prometheus     # Name shown in Grafana UI
      type: prometheus     # Type of datasource
      access: proxy        # How Grafana connects
      # URL points to Prometheus Service within Kubernetes:
      url: http://prometheus-service:9090
      #         ^ Uses the Prometheus Service name!
      isDefault: true      # Make this the default datasource
      editable: true
```

**YOU:** "This tells Grafana where to find Prometheus, using its Kubernetes **Service name** `prometheus-service`. We also have another large ConfigMap (`grafana-dashboards-storage`) containing the JSON definition for a pre-built PostgreSQL dashboard. Grafana reads these on startup - no manual config needed!" [*gesture: automatic setup*]

[**ENGAGEMENT QUESTION**: "What's the benefit of defining dashboards and datasources 'as code' in ConfigMaps? (Hint: Version control, consistency)"]

---

### [SCENE 7: Deploying the Monitoring Stack] - 1 minute
[*TRANSITION: Pan to terminal window*]
[*VISUAL: Clean terminal with command prompt*]

[**PRESENTER NOTE**: Keep deployment steps concise, assuming familiarity from Part 3.]

**YOU:** "With all manifests ready, let's deploy the entire stack!" [*gesture: deployment motion*]

*[**RUN COMMAND**]*
```bash
kubectl apply -f .
```

**YOU:** "Just like in Part 3, `kubectl apply -f .` creates or updates all the resources defined in our YAML files. Let's quickly check the pods:" [*gesture: checking motion*]

*[**RUN COMMAND**]*
```bash
kubectl get pods -w # Use -w to watch status changes
```
*(Wait for all pods: postgres, postgres-exporter, prometheus, grafana to be Running)*
**(Press Ctrl+C to stop watching)**

**YOU:** "Looks good! Now, remember from Part 3, our Prometheus and Grafana Services use `type: LoadBalancer`. To access them locally via Minikube, we need:" [*gesture: recalling tunnel*]

*[**RUN COMMAND** in a new terminal window]*
```bash
minikube tunnel
```
*(Enter password if prompted)*

**YOU:** "With the tunnel running, let's get the service IPs:" [*gesture: IP check*]

*[**RUN COMMAND**]*
```bash
kubectl get services
```

**YOU:** "We should see EXTERNAL-IP addresses listed for `prometheus-service` (port 9090) and `grafana-service` (port 3000). Let's explore!" [*gesture: transition to exploration*]

---

### [SCENE 8: Exploring Prometheus] - 1-2 minutes
[*TRANSITION: Smooth pan to browser window*]
[*VISUAL: Browser navigating to Prometheus UI (using EXTERNAL-IP or localhost:9090)*]

[**PRESENTER NOTE**: Quick tour focusing on scrape targets and one example query.]

**YOU:** "Let's open Prometheus using its IP and port 9090. First, navigate to **Status > Targets**." [*gesture: presenting UI*]

*[**NAVIGATE** to Status > Targets]*

**YOU:** "Excellent! We see our 'postgres' job, and the state is **UP**. This confirms Prometheus is successfully scraping metrics from our exporter." [*gesture: checking status*]

*[**NAVIGATE** to Graph]*

**YOU:** "Now let's run a quick PromQL query. Try `pg_stat_activity_count` to see active database connections." [*gesture: typing query*]

*[**TYPE** query and Execute]*

**YOU:** "We get a graph showing the connection count over time. Prometheus holds all the raw data, but Grafana makes it easier to visualize." [*gesture: showing results*]

[**KNOWLEDGE CHECK**: "Prometheus confirms data collection. Now for visualization."]

---

### [SCENE 9: Exploring Grafana Dashboards] - 1-2 minutes
[*TRANSITION: Switch to Grafana tab in browser*]
[*VISUAL: Browser navigating to Grafana UI (using EXTERNAL-IP or localhost:3000)*]

[**PRESENTER NOTE**: Focus on the pre-configured dashboard.]

**YOU:** "Now, navigate to Grafana using its IP and port 3000. Login with **admin/admin** (you can skip the password change for the demo)." [*gesture: login motion*]

*[**LOGIN** and navigate to Dashboards > Browse]*

**YOU:** "Because we used ConfigMaps for provisioning, our Prometheus datasource is already configured, and we have a 'PostgreSQL Database' dashboard ready to go under the 'General' folder!" [*gesture: highlighting automation benefit*]

*[**OPEN** the PostgreSQL dashboard]*

**YOU:** "Look at this! A rich dashboard visualizing key PostgreSQL metrics like connections, transactions, query performance, cache hit rates, and more - all powered by the data Prometheus is collecting from our exporter." [*gesture: presenting dashboard*]

**YOU:** "This immediate visibility is crucial in production. You can instantly spot trends or anomalies. For example, watch the 'Transactions Per Second' panel - if that drops unexpectedly, you know to investigate." [*gesture: analytical motion*]

**YOU:** "Explore the different panels. This level of insight helps optimize performance and ensure reliability." [*gesture: exploration encouragement*]

[**ENGAGEMENT QUESTION**: "How could a dashboard like this help you troubleshoot a slow application?"]

---

### [SCENE 10: Conclusion] - 30 seconds
[*TRANSITION: Camera view with GDG branding*]
[*VISUAL: Monitoring dashboard with GDG HKUST elements*]

[**PRESENTER NOTE**: Concise wrap-up.]

**YOU:** "And there we have it! 🎉 A full observability stack running in Kubernetes, monitoring our PostgreSQL database using Prometheus and Grafana." [*gesture: accomplished motion*]

**YOU:** "Today we saw how to:
- **Deploy** specialized components like exporters.
- **Configure** Prometheus to scrape targets using ConfigMaps.
- **Provision** Grafana datasources and dashboards automatically." [*gesture: summarizing motion*]

**YOU:** "Observability isn't just graphs; it's understanding your system's health and performance. This is essential for reliable, production-ready applications." [*gesture: importance motion*]

**YOU:** "Thanks for joining this **GDG HKUST** tutorial! Keep exploring, keep building!" [*gesture: friendly wave*]

[**FINAL KNOWLEDGE CHECK**: "We've built upon our Kubernetes deployment skills from Part 3 by adding a vital observability layer."]

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