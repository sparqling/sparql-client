#!/usr/bin/env node

const fs = require('fs').promises;
const program = require('commander');
const version = require('../package.json').version;

const opts = program
  .version(version)
  .arguments('[SPARQL_FILE]')
  .parse(process.argv)
  .opts();

if (program.args.length < 1 && process.stdin.isTTY) {
  program.help();
}

(async () => {
  let sparql;
  if (program.args[0]) {
    try {
      sparql = await fs.readFile(program.args[0], "utf8");
    } catch (err) {
      console.error(`cannot open ${program.args[0]}`);
      process.exit(1);
    }
  } else {
    sparql = await readStdin();
  }
  sparql = sparql.toString();

  console.log(sparql);
})();
