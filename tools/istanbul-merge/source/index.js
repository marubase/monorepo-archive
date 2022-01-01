#!/usr/bin/env node
const fs = require("fs/promises");
const libCoverage = require("istanbul-lib-coverage");
const path = require("path");

if (process.argv.length < 4) {
  const context = `istanbul-merge: Parsing argument.`;
  const problem = `Failed to find input argument.`;
  const solution = `Please provide an input argument.`;
  throw new Error(`${context} ${problem} ${solution}`);
}

const outputName = process.argv[process.argv.length - 1];
if (!outputName) {
  const context = `istanbul-merge: Parsing argument.`;
  const problem = `Failed to find input argument.`;
  const solution = `Please provide an input argument.`;
  throw new Error(`${context} ${problem} ${solution}`);
}

(async () => {
  const coverage = libCoverage.createCoverageMap({});
  const inputNames = process.argv.slice(2, -1);
  for (const inputName of inputNames) {
    const inputFile = path.resolve(process.cwd(), inputName);
    const inputContent = await fs.readFile(inputFile);
    const inputData = JSON.parse(inputContent);

    // Normalize file path
    Object.entries(inputData).forEach(([coverFile, coverData]) => {
      delete inputData[coverFile];
      inputData[path.normalize(coverFile)] = Object.assign(coverData, {
        path: path.normalize(coverData.path),
      });
    });
    coverage.merge(inputData);
  }

  const outputFile = path.resolve(process.cwd(), outputName);
  const outputData = JSON.stringify(coverage);
  await fs.writeFile(outputFile, outputData);
})().catch(console.error);
