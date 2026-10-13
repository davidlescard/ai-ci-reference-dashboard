#!/usr/bin/env bash
# Single entry point for local and CI tasks. Usage: ./build.sh [task]
set -euo pipefail
cd "$(dirname "$0")"

usage() {
  echo "Usage: ./build.sh [install|typecheck|test|build|start|docker|all]"
  echo "  all (default): install, typecheck, test, build"
}

task="${1:-all}"

case "$task" in
  install)   npm ci ;;
  typecheck) npm run typecheck ;;
  test)      npm test ;;
  build)     npm run build ;;
  start)     npm start ;;
  docker)    docker compose up --build ;;
  all)
    npm ci
    npm run typecheck
    npm test
    npm run build
    ;;
  -h|--help|help) usage ;;
  *) usage; exit 1 ;;
esac
