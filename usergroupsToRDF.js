var ndjson = require('ndjson');
var fs = require('fs');

const prefixes = `
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix swV: <http://rdf.slidewiki.org/vocab/> .
@prefix swR: <https://slidewiki.org/usergroup/> .
@prefix swUserR: <https://slidewiki.org/user/> .
@prefix prv: <http://purl.org/net/provenance/ns#> .
`;
//write prefixes
console.log(prefixes);

fs.createReadStream('data/usergroups.txt')
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
  'name',
  'description',
  'isActive',
  'timestamp',
  'members',
  'creator'
];
const idField = '_id';

function convertToRDF(obj) {
  //print turtle
  let id = obj[idField];
  console.log(`
swR:${id} a swV:UserGroup .
  `);
  for(let prop in obj){
    if(selected.indexOf(prop) !== -1){
      if(prop === 'creator'){
        console.log(`
swR:${id} prv:createdBy swUserR:${obj[prop].userid} .
        `);
        continue;
      }
      if(prop === 'members'){
        obj[prop].forEach((item)=>{
          console.log(`
swR:${id} swV:hasMember swUserR:${item.userid} .
          `);
        });
        continue;
      }

      console.log(`
swR:${id} swV:${prop} """${obj[prop] ? obj[prop] : '-'}""" .
      `);
    }
  }
  console.log('################');
}
