const mergePackageJson = require("merge-package.json");
const fs = require("fs");
const { execSync } = require('child_process');

String.prototype.log = function () {
    console.log(this);
    return this;
}

const localFilename = 'package.json';
const baseFilename = 'package.base.json'
const theirsFilename = 'package.theirs.json'

const solvableConflicts = ['package.json', 'pnpm-lock.yaml']

const run = (command) => {
    `Running > ${command}`.log();
    return execSync(command).toString();
}

const conflictingFiles = run('git diff --name-only --diff-filter=U --relative').log()
if(conflictingFiles.split('\n').filter(item => !!item).some(item => !solvableConflicts.includes(item))){
    "Unsolvable conflicts detected! Please solve them manually".log()
    process.exit(1)
}

if(conflictingFiles.includes("package.json")){
    run(`git show :1:package.json > ${baseFilename}`)
    run(`git show :3:package.json > ${theirsFilename}`)

    const localJson = fs.readFileSync(localFilename, "utf-8");
    const baseJson = fs.readFileSync(baseFilename, "utf-8");
    const theirsJson = fs.readFileSync(theirsFilename, "utf-8");

    const mergedJson = mergePackageJson(localJson, baseJson, theirsJson);
    fs.writeFileSync(localFilename, mergedJson, "utf-8");
}

run('pnpm i --frozen-lockfile=false').log()
