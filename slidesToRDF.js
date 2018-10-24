var ndjson = require('ndjson');
var fs = require('fs');

const prefixes = `
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix swV: <http://rdf.slidewiki.org/vocab/> .
@prefix swR: <https://slidewiki.org/slideview/> .
@prefix swTagR: <https://slidewiki.org/tag/> .
@prefix swUserR: <https://slidewiki.org/user/> .
@prefix swDeckR: <https://slidewiki.org/deck/> .
@prefix prv: <http://purl.org/net/provenance/ns#> .
`;
//write prefixes
console.log(prefixes);

fs.createReadStream('data/slides.txt')
  .pipe(ndjson.parse())
  .on('data', function(obj) {
    convertToRDF(obj);
  });

//list of selected properties
const selected = [
  '_id',
  'user',
  'timestamp',
  'lastUpdate',
  'license',
  'contributors', //esp
  'revisions' //esp
];
const idField = '_id';

function convertToRDF(obj) {
  //print turtle
  let id = obj[idField];
console.log('#######'+id+'#########');
  console.log(`
swR:${id} a swV:Slide .
  `);
  for(let prop in obj){
    if(selected.indexOf(prop) !== -1){
      //custom properties
      if(prop === 'user'){
        console.log(`
swR:${id} prv:createdBy swUserR:${obj[prop]} .
        `);
        continue;
      }
      if(prop === 'contributors'){
        obj[prop].forEach((item)=>{
          console.log(`
swR:${id} swV:hasContibutor swUserR:${item.user} .
          `);
        });
        continue;
      }
      if(prop === 'revisions'){
        obj[prop].forEach((item)=>{
          console.log(`
swR:${id} swV:hasRevision swR:${id}-${item.id}  .
swR:${id}-${item.id} a swV:SlideRevision ;
    swV:title """${item.title}""" ;
    swV:timestamp """${item.timestamp}""" ;
    swV:content """${item.content}""" ;
    swV:speakernotes """${item.speakernotes ? item.speakernotes : '-'}""" ;
    prv:createdBy swUserR:${item.user} .
          `);

        });
        continue;
      }
      console.log(`
swR:${id} swV:${prop} """${obj[prop] ? obj[prop] : '-'}""" .
      `);
    }
  }
}
