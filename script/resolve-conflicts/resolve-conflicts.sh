#!/bin/bash

git fetch origin main
git merge origin/main || true
git checkout --ours package.json
node merge-package-json.js

if [[ $? -ne 0 ]]; then
  exit 1
fi

git status --short
if [[ `git status --porcelain` ]] then;
  git add package.json pnpm-lock.yaml
  git commit -m "resolve conflicts in package.json and pnpm-lock.yaml"
fi

git push


