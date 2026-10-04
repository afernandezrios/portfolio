---
title: "ccrun"
description: "A container runtime written from scratch. No Docker, no runc. Just Go and the Linux kernel's own isolation primitives."
stack: ["Go", "Linux"]
github: "https://github.com/afernandezrios/docker-clone"
---

Docker feels like magic. You type `docker run alpine sh` and a tiny Linux system
appears out of nowhere, runs your command and vanishes. It is tempting to
assume something heavy is happening but t isn't. 

A container is **an ordinary Linux process** that has been handed
three kernel features and a directory full of files. That's the whole trick.

`ccrun` exists to prove that by rebuilding it: pull an image from Docker Hub,
unpack it into a directory and start a process inside that directory with the
same kernel mechanisms Docker uses.

The project started from the [Coding Challenges Docker
challenge](https://codingchallenges.fyi/challenges/challenge-docker/) and grew
into a working runtime that can boot a real `alpine` shell.

**The question it answers:** *what is actually happening on my machine when I
run a container?*

# The central idea

There is no `container()` syscall. Linux has no concept of a container. A
"container" is a name we give to a process that happens to have:

| Question                          | Mechanism       | What it does                                            |
| :--                               | :--             | :--                                                     |
| What can this process **see**?    | **Namespaces**  | Private views of hostname, PIDs, mounts, network, users |
| What can this process **use**?    | **cgroups**     | Caps on CPU, memory, and other resources                |
| What can this process **touch**?  | **rootfs**      | A private root directory built from image layers        |

Everything else (CLI, registry protocol, image format) is packaging around
those three things. `ccrun` implements all three by hand.

# Namespaces

A namespace wraps a global system resource so that processes inside it see
their own isolated instance. `ccrun` requests five of them when spawning the
container process:

- **Hostname**: the container can rename itself without renaming the host.
- **PID**: the first process in the new namespace becomes **PID 1**. This is
  why `ps` inside a container shows only a handful of processes, and why
  killing PID 1 tears the container down.
- **Mounts**: mounts performed inside are invisible on the host. There is a
  detail: systemd mounts `/` as *shared*, and mount events propagate between
  namespaces. The whole tree must be marked private before anything runs, so
  nothing leaks back to the host.
- **Cgroup view**: the container sees its own cgroup hierarchy.
- **User mapping**: the one that makes the rest possible without `sudo` on
  the host. Inside the namespace the process is UID 0. The kernel maps that to
  the invoking user's real UID outside:

  ```
  container UID 0  ──►  host UID: your ordinary user
  ```

So "root in the container" is a fiction maintained by the kernel's ID
translation table. It is also why `ccrun` cannot do everything a real
container can.

# Control Groups (cgroups)

Control groups are **a filesystem you write numbers into**. Limits are 
not configured through an API; they are files under `/sys/fs/cgroup/`:

```
cpu.max       ← "50000 100000"       50 ms of CPU per 100 ms = 50% of one core
memory.max    ← "1000M"              hard ceiling; the OOM killer enforces it
cgroup.procs  ← <container PID>      joins the process to the group
```

The supervisor joins the group first (children inherit membership), then
attaches the container's process once it starts. On exit, the cgroup directory
is removed. The lesson: resource limiting is just kernel bookkeeping attached
to a process.

# Root filesystem

An image is not a disk image. It is an ordered list of **diffs** (tarballs
containing only what changed) plus a small JSON config. Building a rootfs
means replaying them in order, where later layers overwrite earlier ones:

```
  alpine.tar.gz       app.tar.gz        config.json
  (layer 1)      ──►  (layer 2)    ──►  (image config)    ──►  rootfs/
  
  Later layers overwrite earlier ones
```

## How a diff deletes a file (whiteouts)

A layer can only *add* and *overwrite* files, so deletions are encoded as
special empty files:

- `.wh.<name>` — "delete `<name>` from the layers below"
- `.wh..wh..opq` — "this directory is opaque; ignore everything below it"

When these markers are found during extraction, the target file or directory
is removed instead of the marker being created. Without this, deleting a file
in a later layer would silently do nothing.

## Hardening

Because a tarball's paths are attacker-controlled, every entry is checked for
path traversal ("zip slip") before being written: the target is resolved
relative to the rootfs and anything that would escape it is refused. Symlinks
and hard links are removed before creation, since a previous layer may have
left something at the same path.

# Pulling an image is just HTTP

The most surprising part of the project: pulling a Docker image is **just HTTP
and JSON**. There is no proprietary binary protocol.

![ccrun-get-image](/portfolio/assets/projects/ccrun-image-get.svg)

# Design decision: two processes, one binary

`ccrun` uses two processes to run a container but both come from the same Go binary.

- **Supervisor (host):** Prepares the container, sets up resource limits and isolation,
starts the child process, monitors its exit, and cleans up afterward.
- **Container init (inside):** Sets up the container environment, mounts `/proc`, 
and starts the user's command as PID 1.

## Why two processes? 

Go programs use multiple threads and Linux namespaces must be configured carefully
to isolate a process correctly. Instead of trying to isolate the already-running 
program, `ccrun` re-launches itself in a fresh process with the required namespaces.

The init process is an internal implementation detail, not a separate CLI command.

```
                host side                                     container side

   ccrun ──────► supervisor ─────── re-execs itself ──────────► init (PID 1)
            (multi-threaded,                           (fresh, single-threaded,
              normal privileges)                          already inside the namespaces)
```

# Deliberate limitations

These are not oversights so much as the boundary of the exercise — and each one
marks where real container runtimes earn their complexity:

- **No layer caching or OverlayFS.** Every run re-downloads and re-extracts
  the whole image into a throwaway directory. Real runtimes store layers once
  and stack them with `overlayfs`, so N containers share one copy of the base
  image.
- **`chroot` instead of `pivot_root`.** `chroot` changes the process's root but
  does not remove the old root from the mount table, and a sufficiently
  privileged process can escape it. `pivot_root` is the correct primitive, and
  it is what `runc` uses.
- **No network namespace.** Containers share the host's network stack. No
  virtual Ethernet pairs, no bridge, no port publishing.
- **No security boundaries.** `ccrun` is a learning tool. Do not run untrusted 
  code in it.
- **Hardcoded assumptions.** The image tag is always `latest`, the registry is
  always Docker Hub and the cgroup limits are fixed constants.

Knowing precisely *why* each of these is missing and what it would take to
add is most of the value of having built the rest by hand.
