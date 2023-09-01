const axios = require('axios');
const version = require('../package.json').version;

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

exports.query = async(endpoint, sparql, format) => {
  const accept = acceptHeaderMap[format];
  const headers = {
    'User-agent': `sparql-client/${version}`,
    Accept: accept
  };
  let requestParams = new URLSearchParams({ 'query': sparql });
  response = await axios.get(endpoint, { params: requestParams, headers: headers });
  body = response.data;
  if (format === 'json') {
    const text = JSON.stringify(body, null, 2);
    console.log(text);
  } else{
    console.log(body);
  }
}
