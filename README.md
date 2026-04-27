# NodeJS Vulnerable App

Intentionally vulnerable NodeJS application with a collection of web vulnerabilities where you can practice on.

## Labs Overview

| Vulnerability | Description | Blog Post |
|---------------|-------------|-----------|
| Command Injection | A Ping Network Diagnostic Tool | https://redteamworld.com/web/command-injection-nodejs/ |
| Reflected XSS | A simple Greetings Page | https://redteamworld.com  |
| Path Traversal | File Showing Page | https://redteamworld.com  |
| SQLi Union Based | Search Page with results | https://redteamworld.com  |
| SQLi Boolean Based | Search Page displaying only number of results | https://redteamworld.com  |

## Run

In order to run the application you just require docker, and run the following commands.

### Docker compose 

```bash
# Run from the repo folder
git clone https://github.com/redteamworld/nodejs-vulnerable-app.git
cd nodejs-vulnerable-app
docker-compose up --build 
```

The NodeJS application will run at http://127.0.0.1:3000

![Sceenshot](image.png)