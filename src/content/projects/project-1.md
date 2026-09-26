---
title: "Distributed Task Queue"
description: "A lightweight, in-memory task queue built with Go and Redis, designed for high-throughput background processing."
stack: ["Go", "Redis", "Docker"]
github: "https://github.com/yourusername/task-queue"
---
Built to solve the problem of unreliable background job processing by implementing a
Redis-backed queue with at-least-once delivery guarantees.

## The problem

Our previous setup ran background jobs in-process. A deploy mid-job meant the work vanished,
and there was no way to see how deep the backlog had grown.

## Design

Jobs are pushed onto a Redis list and claimed by workers using `BRPOPLPUSH`, which moves a job
to a processing list atomically. A worker that dies mid-job leaves its entry in the processing
list, where a reaper returns it to the main queue after a visibility timeout.

- At-least-once delivery, with idempotency keys for handlers that need it
- Per-queue concurrency limits, enforced with a Redis semaphore
- Dead-letter queue after three failed attempts
- Prometheus metrics for queue depth and job latency

The core claim loop is small enough to read in one sitting:

```go
for {
    job, err := r.BRPopLPush(ctx, queue, processing, 30*time.Second)
    if err == redis.Nil {
        continue
    }
    handle(ctx, job)
}
```
