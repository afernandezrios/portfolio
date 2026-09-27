---
title: "My Own Database"
description: "A SQL database engine built from scratch in Go — an educational deep dive into what happens between a query and its rows."
stack: ["Go"]
github: "https://github.com/afernandezrios/my-own-database" # TODO: replace with the real repo URL
---
A database looks like a black box: you type text, rows come back. This project
opens the box and rebuilds the path between those two points by hand, one stage
at a time. It is not meant to be used — it is meant to be read.

## The idea

A database does not really "run SQL". SQL is only the outermost layer. Underneath,
a database is a pipeline of independent components, each with a narrow job:

```
        text          tokens          tree          rows
  you ────────► Lexer ──────► Parser ──────► Engine ──────► you
       SQL                    (AST)        (execution)
```

Each stage receives a structure from the previous one, transforms it, and hands it
over. No stage needs to understand the internals of the others: the lexer does not
know what a table is, the parser does not know where rows are stored, the engine
does not care whether the query was typed in uppercase or lowercase.

That separation is the real subject of the project. It is also how SQLite,
PostgreSQL, and every other database engine are organised — at a much larger
scale.

There is a second, quieter goal: SQL is a language, and this project treats it as
one. Hand-writing a lexer and a parser is the classic way to understand how any
programming language is processed, and SQL is a good candidate because its grammar
is small, well documented, and immediately testable.

## The pipeline, stage by stage

### The interactive shell

The boundary of the system. It reads a line, sends it through the pipeline, prints
the result, and waits for the next line — the same shape as `psql`, `sqlite3`, and
the MySQL client.

One design decision matters more than it looks: the shell talks to abstract input
and output streams rather than the real terminal. That small indirection is what
makes the front end verifiable — text can be fed in and captured out, so every
stage can be checked before the back end exists.

### The lexer

The lexer converts a flat string into a flat list of *tokens* — the smallest
meaningful units of the language, each tagged with a category. `SELECT id FROM
users` becomes four tokens: a `SELECT` keyword, an identifier, a `FROM` keyword,
another identifier. It answers "what are the words?" without caring about grammar.

Case insensitivity is handled in exactly one place: every word is normalised
before lookup, so `SeleCT Id FroM USerS` produces the same tokens as its uppercase
spelling. That single step is all there is to SQL being a "case-insensitive
language".

### The parser

The parser is the grammar checker. It consumes the tokens and answers one
question: is this a valid statement? If so, it produces a tree — a structure that
represents *meaning* rather than *text*.

That tree is what decouples syntax from execution:

```
"SELECT name FROM users"       ─┐
"select name from users"       ─┼──►  one identical tree ──► engine
"SELECT   name   FROM   users" ─┘
```

Three different strings, three different token lists, one identical tree. The
engine only ever sees the tree, so it never has to think about spelling.

The grammar covered today is `SELECT` and `INSERT`, and errors are part of the
interface: each failure reports specifically what is missing, the way a real
database points at where the query broke.

### The execution engine — next

The missing stage. Planned: an in-memory catalogue of tables holding rows, and an
executor that walks the tree and performs the operation — create a table, append a
row, scan and return rows.

Once it exists, the pipeline is complete end to end, and the interesting error
cases become reachable: inserting into a table that does not exist, inserting a row
with the wrong number of values, selecting a column that is not there. All of that
is validation the engine performs — the parser only knows grammar, never schema.

## Where it stands

| Stage | Status |
|---|---|
| Interactive shell | Working — reads, dispatches, exits |
| Lexer | Working for keywords, identifiers, numbers, strings, punctuation |
| Parser | `SELECT` and `INSERT` grammar, with per-clause errors |
| Engine | Not started |
| Persistence | Not started |
| Filtering (`WHERE`) | Not started |

The project is therefore a working *front end* for a database: it understands
queries but cannot yet answer them. The shell prints the parsed statement instead
of executing it — a deliberate scaffolding step that proves the front end before
the back end exists.

## The road ahead

The order matters, because each step forces a new concept:

1. **The in-memory backend** — tables and rows. Introduces schema and storage.
2. **The execution engine** — walking the tree and doing what it says. Introduces
   the separation between parsing and doing.
3. **Filtering (`WHERE`)** — extends the grammar and the executor. The parser must
   carry a comparison, not just names.
4. **Persistence** — the idea that the engine's job includes moving data to and
   from bytes on disk.
5. **Indexing with a B-tree** — why databases are fast: data structures that make
   lookups sublinear, and the trade-off between read speed and write cost.

Beyond that lie the questions real engines spend most of their code on:
transactions, concurrency, on-disk layout, crash recovery, and query planning.
