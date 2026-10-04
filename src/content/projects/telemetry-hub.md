---
title: "Telemetry Hub"
description: "A telemetry ingestion platform scaled from zero to 10,000 requests per second. Every architectural step driven by a measured failure."
stack: ["Go", "Kafka", "PostgreSQL", "Docker"]
github: "https://github.com/afernandezrios/telemetry-hub"
---

`telemetry-hub` is a telemetry ingestion platform built to learn **how to scale
a system from zero to millions of requests**. Telemetry is the vehicle, not the
purpose: metrics are a workload that is easy to generate, easy to measure, and
unbounded by nature, so ideal for studying the mechanics of scaling.

The platform is built in Go and runs on Docker Compose: clients POST metrics
over HTTP, the platform buffers them and persists them into PostgreSQL. The
full vision also covers logs and traces, plus a query API and a dashboard;
today only the metrics path exists.

# The method

Every architectural decision in this project follows the same four-step chain:

```text
use case  →  problem  →  fix  →  tradeoff
```

Nothing is changed "because it is best practice": each change starts from a
measured failure and each fix is accepted together with the cost it introduces.

# The system

![alt text](/portfolio/assets/projects/telemetry-arc.svg)

Each metric is a small payload carrying a timestamp, a service, a name and a
value. The platform answers `202 Accepted` before the metric reaches the
broker or the database. Storage is a single metrics table.

# From a single instance to horizontal scaling

**Use case.** First version: one HTTP API writes every metric to PostgreSQL
with one synchronous write per request.

**Problem.** At 1,500 req/s the test still passes but both layers are running
hot: the app averages ~74% of its CPU limit and PostgreSQL ~67%. Extrapolating
the growth, the synchronous design cannot reach the 10,000 req/s requirement.

**Fix.** Scale out: run 3 replicas of the ingestion service behind a load
balancer. The measurement confirms it. The three replicas show nearly
identical CPU, so traffic is distributed evenly.

**Tradeoff.** Two ways to scale were compared:

- *Vertical scaling*: give the single instance more CPU. Easiest option: no
  architectural change. But CPU is expensive and bounded and a single
  instance is a single point of failure.
- *Horizontal scaling*: run multiple instances. Removes the single point of
  failure but the infrastructure becomes more complex. A load balancer must
  route requests.

The project chose horizontal scaling, keeping vertical scaling in reserve. A
real system would combine both.

# The database write bottleneck

**Use case.** With 3 replicas behind the load balancer, raise the load to
3,000 req/s.

**Problem.** The test crashes. At 3,000 req/s every request triggers one
synchronous database transaction, so PostgreSQL saturates and the app's
connection pool fills up. Meanwhile the load balancer also reaches its CPU
limit, in-flight requests pile up, and the client exhausts its resources.

**Fix.** Stop writing per request. The ingestion service buffers metrics in
memory and flushes them in batches of 250. Database transactions drop from
3,000/sec to ~12/sec. Result: 3,000 req/s with 100% success, database CPU down
from a bottleneck to ~13%, and P50 latency down to 1.44 ms because the handler
no longer waits for the database.

**Tradeoff.** Batching trades correctness properties for throughput:

- **Eventual consistency.** Users do not see their metric immediately after
  POSTing it.
- **Data loss window.** The API acknowledges before the metric is persisted.
  If the instance crashes, everything in the buffer is lost (and clients
  were already told it was accepted!).
- **Batch failure handling.** If one row fails, the whole batch fails. Before,
  failures were isolated per request.

# Decoupling ingestion from storage with Kafka

**Use case.** Multiple ingestion instances, each buffering metrics in memory
before writing to the database.

**Problem.** In-memory batching has three structural problems:

1. If an instance crashes, scales down or restarts, its buffer is lost.
2. The ingestion path is coupled to the database: if the database is slow or
   unavailable, ingestion slows down or fails with it.
3. If another service needs the same metrics, the ingestion app must be
   modified to send to it.

**Fix.** Insert a message broker between ingestion and storage. Ingestion
publishes to a Kafka topic and returns `202 Accepted`. A separate consumer
reads the topic and persists to PostgreSQL at its own pace. Kafka acts as a
durable buffer: it absorbs traffic spikes. Any future service can consume
the same topic with no change to ingestion.

**Tradeoff.** Two producer modes were measured:

- *Synchronous*: `202` returned only after Kafka acknowledges the message.
  Zero data loss but P50 latency is 364 ms and the load balancer needs
  ~600 MB of RAM because slow responses force many concurrent open
  connections.
- *Asynchronous*: `202` returned as soon as the message is queued in memory.
  P50 drops to 2 ms and load balancer RAM to ~99 MB, but a hard failure can
  lose the messages still in the queue.

The project chose asynchronous for throughput, accepting the small loss
window.

**Partitions sub-tradeoff.** A single Kafka log file caps throughput to one
machine's capacity. Splitting the topic into 6 partitions lets producers write
in parallel and consumers read in parallel. This lets the topic grow beyond one
machine. The costs: 
- ordering is guaranteed only within a partition.
- increasing partitions is irreversible. More partitions mean more log files and broker I/O. 

Measured on the same 3,000 req/s load: 6 partitions cost 54% producer
CPU vs 37% with 1.

# The load balancer becomes the bottleneck

**Use case.** Run the load test at the target rate: 10,000 req/s.

**Problem.** Throughput 3,795 req/s and success drops to 76%.
Every other component is healthy; the load balancer (Traefik) is the
bottleneck at 229% average CPU.

**Fix.** Replace Traefik with nginx. A static reverse proxy that delivers the
same routing with far less CPU.

**Tradeoff.** Traefik's dynamic runtime is convenient. It discovers services
automatically, which was useful while the architecture was changing every
experiment. But that flexibility burns CPU under stress. nginx is faster and
lighter but every upstream change must be configured by hand. The project
accepted static configuration in exchange for headroom.

# Configuration limits, not architectural ones

**Use case.** With nginx in place, run 10,000 req/s again.

**Problem.** Throughput *drops* to 2,064 req/s and success to 56%. Three
nginx defaults are silently capping the system:
- a single worker process handles all traffic
- connections to the backend are not reused between requests
- a low cap on requests per connection forces constant reconnection churn.

**Fix.** One worker per core, reuse of idle backend connections and a much
higher per-connection request cap. Throughput rises to 6,718 req/s at 97%
success. Progress, but still far from the initial goal.

**Problem.** The remaining failures come from the *load test itself*, not 
the system. The load-testing tool was configured with 5,000 workers. 
It paces requests at a fixed rate and keeps at most one request per
worker in flight. When the server slows, it opens more workers, more
requests wait in flight, latency grows and the spiral ends in client timeouts
and exhausted network ports. More workers do not mean more throughput.

**Fix.** Size workers from Little's law:

```text
workers needed ≈ target rate × expected response time ≈ 10,000 req/s × 20 ms ≈ 200
```

The test runs with 50 initial workers and a 500 ceiling.

**Tradeoff / lesson.** Concurrency is a function of rate and latency, not a
knob to turn up. Misunderstanding the tool produced errors that looked like
system failures. The harness must be measured and understood like any other
component.

**Result.** 9,998 req/s with 100% success, P95 86.5 ms (requirement: < 500
ms), P99 133 ms, worst case 323 ms. Exactly 600,000 writes in 60 s. Produced,
consumed, and persisted at the full rate.

# Where the platform stands and what comes next

Current state: the 10,000 req/s requirement is met end-to-end with headroom in
every component except the load balancer, which saturates first (~153% avg
CPU).

Known limitations, each of which is the next problem in the chain:

- **Only metrics.** Logs and traces are still requirements, not implemented.
- **Single points of failure.** One Kafka broker, one PostgreSQL instance,
  replication factor 1. Neither survives a node failure. The system is built
  for throughput, not yet for availability.
- **Coarse failure handling.** A failed batch is logged and dropped, not
  retried or dead-lettered.
- **No backpressure signal to clients.** When the Kafka queue is full, the
  caller only sees a failed request.
- **No query API or dashboard.** Data goes in; nothing reads it out.
