var ndjson = require('ndjson');
var fs = require('fs');

const prefixes = `
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix swV: <http://rdf.slidewiki.org/vocab/> .
@prefix swR: <https://slidewiki.org/tag/> .
@prefix swUserR: <https://slidewiki.org/user/> .
@prefix prv: <http://purl.org/net/provenance/ns#> .
`;
//write prefixes
console.log(prefixes);

fs.createReadStream('data/tags.txt')
  .pipe(ndjson.parse())
  .on('data', function(obj) {
    convertToRDF(obj);
  })
  .on('error', function(obj) {
    console.log('#######Error#########');
  });

//list of selected properties
const selected = [
  '_id',
  'defaultName',
  'user',
  'tagName',
  'timestamp'
];
const idField = '_id';

function convertToRDF(obj) {
  //print turtle
  let id = obj[idField];
console.log('#######'+id+'#########');
  console.log(`swR:${id} a swV:Tag .`);
  for(let prop in obj){
    if(selected.indexOf(prop) !== -1){
      //custom properties
      if(prop === 'user'){
        console.log(`swR:${id} prv:createdBy swUserR:${obj[prop]} .`);
        continue;
      }
      console.log(`swR:${id} swV:${prop} """${obj[prop] ? obj[prop] : '-'}""" .`);
    }
  }
}
