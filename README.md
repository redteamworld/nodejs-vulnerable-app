# Vulnerable Web Security Labs

A collection of intentionally vulnerable applications for learning web security.

## Labs Overview

| Vulnerability | Language | Lab | Blog Post |
|---------------|----------|-----|----------|
| Command Injection | Node.js | link | link |

## Run Labs

Each lab can be easily setup with docker on a linux machine after downloading specific vulnerable web application files.

### Docker compose 

```bash
# Run from inside the lab folder
cd /nodejs-ping-lab
docker-compose up --build 
```


### Manual build and run 

```bash

# Build image
dokcer build -t <container_name> ./ 
docker images

# Run container in interactive mode
docker run -it --name <container_name> -p 8000:8000

# Run container in background
docker run -d --name <container_name> -p 8000:8000

# Attach to container to see output
docker attach --name <container_name>

# Run interactive shell on container
docker exec -it --name <container_name> sh

```