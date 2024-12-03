const mergePackageJson = require("merge-package.json");
import fs from "fs";

const localFilename = "package.json";
const baseFilename = "package.json.base";
const theirsFilename = "package.json.theirs";

const localJson = fs.readFileSync(localFilename, "utf-8");
const baseJson = fs.readFileSync(baseFilename, "utf-8");
const theirsJson = fs.readFileSync(theirsFilename, "utf-8");

const mergedJson = mergePackageJson(localJson, baseJson, theirsJson);
fs.writeFileSync(localFilename, mergedJson, "utf-8");
