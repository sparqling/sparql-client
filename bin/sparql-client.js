#!/usr/bin/env node

const fs = require('fs').promises;
const axios = require('axios');
const program = require('commander');
const version = require('../package.json').version;

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

const acceptHeaderMap = {
  "xml"      : "application/sparql-results+xml",
  "json"     : "application/sparql-results+json",
  "tsv"      : "application/sparql-results+json", // receive as json and format to tsv afterward
  "text"     : "text/tab-separated-values",
  "csv"      : "text/csv",
  "n-triples": "text/plain",
  "nt"       : "text/plain",
  "n3"       : "text/rdf+n3",
  "html"     : "text/html",
  "bool"     : "text/boolean",
  "turtle"   : "application/x-turtle",
  "ttl"      : "application/x-turtle",
  "rdf/xml"  : "application/rdf+xml",
  "rdfxml"   : "application/rdf+xml",
  "rdfjson"  : "application/rdf+json",
  "rdfbin"   : "application/x-binary-rdf",
  "rdfbint"  : "application/x-binary-rdf-results-table",
  "js"       : "application/javascript",
};

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

  const accept = acceptHeaderMap[opts.format];
  const headers = {
    'User-agent': `sparql-client/${version}`,
    Accept: accept
  };
  let requestParams = new URLSearchParams({ 'query': sparql });
  response = await axios.get(opts.endpoint, { params: requestParams, headers: headers });
  if (opts.format === 'json') {
    body = JSON.stringify(response.data, null, 2);
  } else{
      body = response.data;
  }
  console.log(body);
})();
