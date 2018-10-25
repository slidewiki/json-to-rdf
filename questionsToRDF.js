var ndjson = require('ldjson-stream');
var fs = require('fs');

const prefixes = `
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix swV: <http://rdf.slidewiki.org/vocab/> .
@prefix swR: <https://slidewiki.org/question/> .
@prefix swUserR: <https://slidewiki.org/user/> .
@prefix swSlideR: <https://slidewiki.org/slideview/> .
@prefix swDeckR: <https://slidewiki.org/deck/> .
@prefix prv: <http://purl.org/net/provenance/ns#> .
`;
//write prefixes
console.log(prefixes);

fs.createReadStream('data/questions.txt')
  .pipe(ndjson.parse({strict: false}))
  .on('data', function(obj) {
    convertToRDF(obj);
  })
  .on('error', function(obj) {
    console.log('#######Error#########');
  });

//list of selected properties
const selected = [
  '_id',
  'user_id',
  'related_object_id',
  'related_object',
  'difficulty',
  'question'
];
const idField = '_id';

function convertToRDF(obj) {
  //print turtle
  let id = obj[idField];
  console.log(`swR:${id} a swV:Question .`);
  let type = '';
  let oid = '';
  for(let prop in obj){
    if(selected.indexOf(prop) !== -1){
      if(prop === 'user_id'){
        console.log(`swR:${id} prv:createdBy swUserR:${obj[prop]} .`);
        continue;
      }
      if(prop === 'related_object'){
        type = obj[prop];
      }
      if(prop === 'related_object'){
        type = obj[prop];
      }
      if(prop === 'related_object_id'){
        oid = obj[prop];
      }
      console.log(`swR:${id} swV:${prop} """${obj[prop] ? obj[prop] : '-'}""" .`);
    }
  }
  if(type === 'slide'){
        console.log(`swR:${id} swV:relatedTo  swSlideR:${oid} .`);
  }else{
      console.log(`swR:${id} swV:relatedTo  swDeckR:${oid} .`);
  }
  console.log('################');
}
