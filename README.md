# Quality Gate Lab

Release Quality Dashboard: a small React + Express + SQLite app used as a target for test automation and CI/CD.

## Run

Requires Node 22+ (24 recommended) and optionally Docker.

```
./build.sh           # install, typecheck, test, build
./build.sh start     # http://localhost:3000
./build.sh docker    # docker compose up --build, health at /health
```

Individual tasks: `install`, `typecheck`, `test` (Mocha unit and API tests), `build`, `start`, `docker`.

Development (two terminals): `npm run dev:api` and `npm run dev:web` (http://localhost:5173).

On Windows, run the script from Git Bash or WSL.

## Test support

`POST /api/test/reset` restores the seed data. It exists only when `ENABLE_TEST_RESET=true` (set in `docker-compose.yml`, never in deployed environments).
