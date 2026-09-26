---
title: "Log Aggregator CLI"
description: "A terminal tool in Rust that streams, filters, and formats logs from multiple sources with sub-millisecond overhead."
stack: ["Rust", "Tokio", "CLI"]
github: "https://github.com/yourusername/log-aggregator"
demo: "https://example.com/log-aggregator"
---
Wanted a single-pane view over several log files during local development, so I wrote a zero-copy parser that tails many files at once.
