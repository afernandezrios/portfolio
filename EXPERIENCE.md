# Software Engineer — Professional Experience

## Phoenix Contact — Software Engineer
**June 2021 – Present · Asturias, Spain**

I work as a Software Engineer at Phoenix Contact, primarily focused on backend development using **Java and Spring Boot**, with additional experience across cloud infrastructure, frontend development, CI/CD, testing, and system architecture.

Most of my work has been centered around a **Digital Twin platform** used to create digital representations of manufactured assets. The platform integrates information from multiple sources, processes and normalizes that information, and exposes it through REST APIs and user-facing workflows.

My role has evolved from implementing individual features to taking greater ownership of technical decisions, architecture, production problems, and end-to-end delivery.

### Backend Engineering

My main area of expertise is backend development with **Java and Spring Boot**.

I design and implement REST APIs and backend services, work with relational and document databases, integrate external and internal systems, and build business logic around domain concepts.

The Digital Twin platform works with a large number of product assets and data coming from different sources. One of the recurring engineering challenges is transforming this heterogeneous information into a consistent domain model that can be consumed by other parts of the system.

My responsibilities include:

- Designing and implementing REST APIs.
- Developing business logic using Java and Spring.
- Integrating data from multiple systems and sources.
- Transforming and normalizing incoming data.
- Designing domain models and separating business responsibilities.
- Implementing new product features together with the Product Manager.
- Investigating and resolving production issues.
- Working with PostgreSQL/AWS Aurora and MongoDB.
- Writing unit, integration, and end-to-end tests.
- Reviewing and improving existing code.

---

## Modernizing a Legacy Digital Twin Platform

One of the larger technical challenges I worked on was the modernization of a legacy application that had grown around a large number of responsibilities.

The application was responsible for handling data associated with **millions of product assets**, but its internal structure made the system increasingly difficult to maintain and extend.

I participated in refactoring the application toward a **modular monolith architecture**, introducing clearer domain boundaries and separating responsibilities into more explicit bounded contexts.

The goal was not simply to rewrite existing code, but to make the system easier to understand and evolve while keeping it operational.

This involved:

- Identifying existing domain responsibilities.
- Separating functionality into clearer modules.
- Establishing boundaries between different parts of the domain.
- Reducing coupling between unrelated functionality.
- Moving away from a structure where business responsibilities were heavily intertwined.
- Preserving existing functionality while introducing the new architecture incrementally.

This experience gave me practical experience with **domain-driven design concepts, modular monoliths, bounded contexts, refactoring legacy systems, and incremental architectural change**.

---

# AWS and Event-Driven Systems

A significant part of my recent work has involved building asynchronous workflows using AWS services.

I have worked with:

- **AWS Lambda**
- **Amazon EventBridge**
- **AWS Step Functions**
- **AWS Batch**
- **Amazon S3**
- **Amazon Aurora**
- **OpenSearch**

One example was the generation of PDF previews.

Originally, the application generated PDF previews synchronously as part of the main request. This became problematic because large PDFs could make requests take more than **30 seconds**, particularly under load.

I investigated the problem using application logs, OpenSearch and metrics, and redesigned the workflow so that preview generation happened asynchronously.

The new workflow follows a pattern similar to:

**Application → S3 → EventBridge → Lambda**

The user-facing operation only needs to upload the PDF to S3, which reduced that part of the operation to **less than one second**. The preview generation then happens asynchronously without blocking the original request.

For larger one-time processing operations, I used **AWS Step Functions**.

As part of a migration, a Step Functions workflow generated more than **100,000 preview images in a few minutes**.

This work gave me practical experience with:

- Event-driven architecture.
- Asynchronous processing.
- Serverless workloads.
- AWS orchestration.
- Large batch operations.
- Separating user-facing operations from background processing.
- Monitoring production workloads.
- Designing workflows around independent processing stages.

I also worked on an AWS workflow for generating and updating the public product catalog, processing **more than 60,000 article updates per month**.

---

# Production Troubleshooting and Observability

My experience with production systems has also influenced how I approach software development.

Rather than looking only at source code when investigating problems, I use production information such as:

- Application logs.
- Metrics.
- OpenSearch.
- AWS monitoring information.
- Pipeline results.
- Error patterns.
- Request processing times.

For example, the PDF-preview redesign came from observing the actual behavior of the system under load rather than treating asynchronous processing as an architectural exercise in isolation.

I've also worked on production problems where failures in software services could affect manufacturing operations. This gave me a practical appreciation for **reliability, observability and failure handling**, particularly when software is connected to physical production processes.

---

# CI/CD and Automated Testing

I have worked extensively with **GitLab CI/CD**, automated testing and development tooling.

Our pipelines automatically build, test and deploy applications.

One improvement I implemented reduced the pipeline execution time from approximately **15 minutes to 7 minutes**.

A significant part of the improvement came from optimizing the pipeline and avoiding unnecessary recreation of infrastructure used by integration tests. In particular, I worked with **Testcontainers** and reused containers between integration-test stages where appropriate.

My testing experience includes:

- Unit tests.
- Integration tests.
- End-to-end tests.
- Testcontainers.
- API testing.
- Automated regression testing.

For E2E testing I have also worked with **Playwright**.

I consider automated testing an important part of backend development rather than something added after implementation.

---

# Full-Stack Experience

Although backend engineering is my primary specialization, I have also contributed to frontend applications.

I have worked with:

- **Vue.js**
- **JavaScript**
- HTML
- CSS

For example, I contributed Vue.js components and pages for the company's website.

This experience means I can work across the stack when necessary and understand how backend APIs, frontend applications and user workflows fit together.

I still consider **backend engineering my strongest area** and the direction in which I want to continue developing.

---

# Working with Product and Requirements

My responsibilities are not limited to implementing predefined technical tasks.

I work with the Product Manager to understand requirements, break them down into technical work, identify implementation approaches and deliver the resulting functionality.

This has involved:

1. Understanding the business requirement.
2. Identifying the affected parts of the system.
3. Evaluating implementation alternatives.
4. Making technical decisions.
5. Implementing the functionality.
6. Adding appropriate automated tests.
7. Deploying the changes through CI/CD.
8. Monitoring and troubleshooting the resulting behavior.

This has progressively given me more ownership over features and technical decisions.

---

# Earlier Experience — Alisys

## Software Engineer
**June 2020 – June 2021**

Before joining Phoenix Contact, I worked as a Software Engineer at Alisys, where I worked on software involving **real-time video, specialized hardware and low-latency communication**.

This role exposed me to technologies and engineering problems quite different from my current backend work.

### Real-Time Video

I worked with **C++, FFmpeg and Linux** to process real-time video coming from specialized hardware.

I also worked with **Node.js and TypeScript** to stream video to browsers, achieving latency of **less than 100 ms** in the relevant system.

This experience gave me exposure to:

- C++.
- Linux.
- FFmpeg.
- Real-time processing.
- Video codecs and pipelines.
- Low-latency communication.
- Browser-based video streaming.
- Hardware/software integration.

### Rapid Prototyping

I also worked on an infrared-camera prototype designed to detect elevated body temperature.

The project had limited documentation and required me to understand unfamiliar hardware and software components quickly.

I developed a working prototype in **less than one week**.

This was an early example of something that has remained useful throughout my career: being able to enter an unfamiliar technical area, understand the existing system quickly, and start producing useful results without requiring extensive prior knowledge of the technology.

---

# Earlier Web and Integration Experience

Before and alongside my later engineering work, I also worked on web-based systems involving:

- JavaScript.
- HTML/CSS.
- REST APIs.
- System integrations.
- Data visualization.

This gave me an early foundation in web development and API-based integration before my focus moved increasingly toward backend engineering and cloud-based systems.

---

# Technology Experience

### Languages

**Primary**

- Java
- JavaScript

**Additional experience**

- C++
- TypeScript
- SQL
- Python — beginner level
- HTML
- CSS

### Backend

- Spring
- Spring Boot
- REST APIs
- Modular monolith architecture
- Domain modelling
- Event-driven architecture
- Asynchronous processing
- System integrations

### Cloud / AWS

- AWS Lambda
- Amazon EventBridge
- AWS Step Functions
- AWS Batch
- Amazon S3
- Amazon Aurora
- AWS-based production systems

### Databases

- PostgreSQL
- Amazon Aurora
- MongoDB

### Frontend

- Vue.js
- JavaScript
- HTML
- CSS

### Testing

- Unit testing
- Integration testing
- End-to-end testing
- Testcontainers
- Playwright

### DevOps / Engineering Tools

- GitLab CI/CD
- Docker
- Maven
- npm
- Git
- SonarQube
- OpenSearch

### Engineering Practices

- Agile development
- Code reviews
- SOLID principles
- Automated testing
- CI/CD
- Refactoring
- Domain separation
- Observability
- Production troubleshooting

---

# How I Would Position You on the Portfolio

I would **not** describe you simply as:

> "Java developer with 5+ years of experience."

That undersells your experience.

A more accurate positioning is:

> **Software Engineer specializing in backend systems, Java/Spring Boot and AWS, with experience building and modernizing production software, event-driven workflows, REST APIs and cloud-based systems.**

And the deeper story of your experience is:

**Backend engineering → real production systems → architecture/refactoring → AWS/event-driven processing → testing/CI/CD → production troubleshooting → increasing technical ownership.**

That's a coherent engineering progression and gives your portfolio substantially more substance than a conventional CV.