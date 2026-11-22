---
title: "LearningDB"
description: "A SQL database engine built from scratch in Go. An educational deep dive into what happens between a query and its rows."
stack: ["Go"]
github: "https://github.com/afernandezrios/learning-db"
---

A database looks like a black box: you type text, rows come back. This project
opens the box and rebuilds the path between those two points by hand. 
It is not meant to be used, it is meant to be read.

# The idea

A database does not really "run SQL". SQL is only the outermost layer. Underneath,
a database is a pipeline of independent components, each with a narrow job:

```
        text          tokens          tree          rows
  you ────────► Lexer ──────► Parser ──────► Engine ──────► you
       SQL                    (AST)        (execution)
```

Each stage receives a structure from the previous one, transforms it and hands it
over. No stage needs to understand the internals of the others: the lexer does not
know what a table is, the parser does not know where rows are stored, the engine
does not care whether the query was typed in uppercase or lowercase.

That separation is the real subject of the project. It is also how SQLite,
PostgreSQL and every other database engine are organised (at a much larger
scale)

There is a second goal: SQL is a language and this project treats it as
one. Hand-writing a lexer and a parser is the classic way to understand how any
programming language is processed. SQL is a good candidate because its grammar
is small, well documented and immediately testable.

# The lexer

The lexer converts a flat string into a flat list of *tokens*. The smallest
meaningful units of the language, each tagged with a category. 

`SELECT id FROM users` becomes four tokens: 
- a `SELECT` keyword
- an identifier
- a `FROM` keyword
- another identifier 

It answers "what are the words?" without caring about grammar.

Case insensitivity is handled in exactly one place: every word is normalised
before lookup, so `SeleCT Id FroM USerS` produces the same tokens as its uppercase
spelling. That single step is all there is to SQL being a "case-insensitive
language".

# The parser

The parser is the grammar checker. It consumes the tokens and answers one
question: is this a valid statement? 

If so, it produces a tree. A structure that represents *meaning* rather than *text*.

That tree is what decouples syntax from execution:

```
"SELECT name FROM users"       ─┐
"select name from users"       ─┼──►  one identical tree ──► engine
"SELECT   name   FROM   users" ─┘
```

Three different strings, three different token lists, one identical tree. The
engine only ever sees the tree, so it never has to think about spelling.

The grammar covered today is `SELECT` and `INSERT`. Errors are part of the
interface: each failure reports specifically what is missing, the way a real
database points at where the query broke.

# The execution engine

The engine receives the AST and dispatches it to the backend, which validates 
the requested operation against the table schema and performs it.

Tables and rows live in memory. The current implementation supports creating tables, 
inserting rows and selecting data, including filtering records with `WHERE` conditions.

The important part is that parsing and execution remain separate. The parser knows 
whether a statement is grammatically valid. The backend knows whether the requested 
operation makes sense for the actual data.

# Indexing

A database that scans every row to find a single record does not scale very well. This 
is where indexes come in.

Tables created with an `id` column automatically get an in-memory B-tree index. The 
backend maintains it on every insert and uses it for equality lookups such as `WHERE id = 42`.

Instead of checking every row, the engine can use the tree to navigate directly to the 
requested record. Other filters still fall back to a sequential scan.

I also added a load test to compare both approaches. It runs real SQL statements through the 
complete pipeline and measures inserts and point queries at different table sizes.

At 100,000 rows, an indexed lookup takes around 2.8 µs on my machine, compared with 1.08 ms 
without the index (~390 times faster).

There is a trade-off, of course: maintaining the index adds some overhead to inserts. The 
interesting part is seeing how that small write cost changes the behaviour of reads as the 
table grows.

# Where it stands

The project currently has a working SQL pipeline, an in-memory backend and an integrated 
B-tree index. It is still a deliberately small database: no persistence, transactions or 
concurrent access yet.

# The road ahead

The next steps are to introduce persistence through a write-ahead log, add transaction 
support and explore how concurrent operations interact with the database.

Beyond that lie the questions real engines spend most of their code on: page storage, 
buffer pools, crash recovery and query planning.