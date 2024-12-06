const mergePackageJson = require("merge-package.json");
const fs = require("fs");
const { execSync } = require('child_process');

const localFilename = 'package.json';
const baseFilename = 'package.base.json'
const theirsFilename = 'package.theirs.json'

const solvableConflicts = ['package.json', 'pnpm-lock.yaml']

const run = (command) => {
    console.log(`Running ${command}`);
    return execSync(command).toString();
}

const conflictingFiles = run('git diff --name-only --diff-filter=U --relative')
if(conflictingFiles.split('\n').filter(item => !!item).some(item => !solvableConflicts.includes(item))){
    console.log("Unsolvable conflicts detected! Please solve them manually")
    process.exit(1)
}

run(`git show :1:package.json > ${baseFilename}`)
run(`git show :3:package.json > ${theirsFilename}`)

const localJson = fs.readFileSync(localFilename, "utf-8");
const baseJson = fs.readFileSync(baseFilename, "utf-8");
const theirsJson = fs.readFileSync(theirsFilename, "utf-8");

const mergedJson = mergePackageJson(localJson, baseJson, theirsJson);
fs.writeFileSync(localFilename, mergedJson, "utf-8");

run('pnpm i --frozen-lockfile=false')
