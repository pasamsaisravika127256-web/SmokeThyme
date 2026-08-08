# Smoke & Thyme — Local project

This repository contains a simple Node/Express backend that serves a static frontend.

Quick start locally:

```bash
# install dependencies for the backend
cd backend
npm install

# run the server
npm start
```

Deploying (recommended: Render or Railway)

1. Create a GitHub repository and push this project (root contains `package.json` with `start` script).
2. On Render: Create a new "Web Service", connect your GitHub repo, set the build command to `npm install --production=false --prefix backend && npm install --prefix .` (optional) and the start command to `npm start`. Render will set the `PORT` env var automatically.
3. On Railway: Create a new project, link the repo, and set the service to a Node.js service. Use `npm start` as the start command.

After deployment, the service will have a public HTTPS URL — share that with users; there will be no localtunnel warning.

If you want, I can:
- help push the repo to GitHub from this machine
- provide the exact Render/Railway steps and commands
