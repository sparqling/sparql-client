#!/usr/bin/env node

const fs = require('fs').promises;
const program = require('commander');

const version = require('../package.json').version;
const sparqlClient = require('../lib/sparql-client.js');

const opts = program
  .option('-e, --endpoint <ENDPOINT>', 'target SPARQL endpoint', 'https://spang.dbcls.jp/sparql-test')
  .option('-f, --format <FORMAT>', 'tsv, json, n-triples (nt), turtle (ttl), rdf/xml (rdfxml), n3, xml, html, text', 'json')
  .version(version)
  .arguments('[SPARQL_FILE]')
  .parse(process.argv)
  .opts();

if (program.args.length < 1 && process.stdin.isTTY) {
  program.help();
}

(async () => {
  let sparql = '';
  if (program.args[0]) {
    try {
      sparql = await fs.readFile(program.args[0], "utf8");
    } catch (err) {
      console.error(`cannot open ${program.args[0]}`);
      process.exit(1);
    }
  } else {
    process.stdin.setEncoding('utf8');
    for await (const chunk of process.stdin) {
      sparql += chunk;
    }
  }

  const result = await sparqlClient.query(opts.endpoint, sparql, opts.format);
  console.log(result);
})();
