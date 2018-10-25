var ndjson = require('ndjson');
var fs = require('fs');

const prefixes = `
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix swV: <http://rdf.slidewiki.org/vocab/> .
@prefix swR: <https://slidewiki.org/user/> .
`;
//write prefixes
console.log(prefixes);

fs.createReadStream('data/users.txt')
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
  'username',
  'forename',
  'surname',
  'country',
  'picture',
  'description',
  'organization',
  'registered'
];
const idField = '_id';
//todo: list of mapping to other vocabs
const mappings ={
  'picture': 'foaf:picture'
}
function convertToRDF(obj) {
  //print turtle
  let id = obj[idField];
  console.log(`swR:${id} a swV:User .`);
  for(let prop in obj){
    if(selected.indexOf(prop) !== -1){
      if(prop === 'picture'){
        console.log(`swR:${id} swV:${prop} """${obj[prop]}""" .`);
        continue;
      }
      //additional triples
      if(prop === 'registered'){
        if(obj[prop]){
          let dt = new Date(obj[prop]) ;
          console.log(`swR:${id} swV:registeredYear "${dt.getFullYear()}" .`);
          console.log(`swR:${id} swV:registeredMonth "${dt.getMonth() + 1}" .`);
          console.log(`swR:${id} swV:registeredDay "${dt.getDate()}" .`);
          console.log(`swR:${id} swV:registeredDate "${dt.toLocaleDateString()}" .`);
        }
      }
      console.log(`swR:${id} swV:${prop} """${obj[prop] ? obj[prop] : '-'}""" .`);
    }
  }
  console.log('################');
}
