var ndjson = require('ndjson');
var fs = require('fs');

const prefixes = `
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix swV: <http://rdf.slidewiki.org/vocab/> .
@prefix swR: <https://slidewiki.org/deck/> .
@prefix swTagR: <https://slidewiki.org/tag/> .
@prefix swUserR: <https://slidewiki.org/user/> .
@prefix swSlideR: <https://slidewiki.org/slideview/> .
@prefix prv: <http://purl.org/net/provenance/ns#> .
`;
//write prefixes
console.log(prefixes);

fs.createReadStream('data/decks.txt')
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
  'hidden',
  'user',
  'description',
  'timestamp',
  'lastUpdate',
  'license',
  'contributors', //esp
  'active',
  'latestRevisionId',
  'revisions' //esp
];
const idField = '_id';

function convertToRDF(obj) {
  //print turtle
  let id = obj[idField];
console.log('#######'+id+'#########');
  console.log(`swR:${id} a swV:Deck .`);
  for(let prop in obj){
    if(selected.indexOf(prop) !== -1){
      //custom properties
      if(prop === 'user'){
        console.log(`swR:${id} prv:createdBy swUserR:${obj[prop]} .`);
        continue;
      }
      if(prop === 'contributors'){
        obj[prop].forEach((item)=>{
          console.log(`swR:${id} swV:hasContibutor swUserR:${item.user} .`);
        });
        continue;
      }
      if(prop === 'revisions'){
        obj[prop].forEach((item)=>{
          let dt = new Date(item.timestamp) ;
          console.log(`
swR:${id} swV:hasRevision swR:${id}-${item.id}  .
swR:${id}-${item.id} a swV:DeckRevision ;
    swV:title """${JSON.stringify(item.title)}""" ;
    swV:timestamp """${item.timestamp}""" ;
    swV:timestampYear "${dt.getFullYear()}" ;
    swV:timestampMonth "${dt.getMonth() + 1}" ;
    swV:timestampDay "${dt.getDate()}" ;
    swV:timestampDate "${dt.toLocaleDateString()}" ;
    swV:lastUpdate """${item.lastUpdate}""" ;
    swV:language """${item.language}""" ;
    swV:abstract """${item.abstract ? encodeURIComponent(item.abstract) : '-'}""" ;
    swV:theme """${item.theme}""" ;
    swV:allowMarkdown """${item.allowMarkdown}""" ;
    prv:createdBy swUserR:${item.user} .`);
          if(item.tags.length){
            item.tags.forEach((tag)=>{
              if(tag.id){
                console.log(`swR:${id}-${item.id} swV:hasTag swTagR:${tag.id} .`);
              }
              if(tag.tagName) {
                console.log(`swR:${id}-${item.id} swV:hasTag """${tag.tagName}""" .`);
              }
            });
          }
          item.contentItems.forEach((content)=>{
            if(content.kind === 'slide'){
              console.log(`
swR:${id}-${item.id} swV:hasContentItem <https://slidewiki.org/deck/${id}-${item.id}/${content.kind}/${content.ref.id}-${content.ref.revision}> .
<https://slidewiki.org/deck/${id}-${item.id}/${content.kind}/${content.ref.id}-${content.ref.revision}>  a swV:SlideRevisionUsedInDeck ;
    swV:isRevisedFrom swSlideR:${content.ref.id} ;
    swV:isEqualTo swSlideR:${content.ref.id}-${content.ref.revision} ;
    swV:order """${content.order}""" .`);
            }else{
              console.log(`
swR:${id}-${item.id} swV:hasContentItem <https://slidewiki.org/deck/${id}-${item.id}/${content.kind}/${content.ref.id}-${content.ref.revision}> .
<https://slidewiki.org/deck/${id}-${item.id}/${content.kind}/${content.ref.id}-${content.ref.revision}>  a swV:DeckRevisionUsedInDeck ;
    swV:isRevisedFrom swR:${content.ref.id} ;
    swV:isEqualTo swR:${content.ref.id}-${content.ref.revision} ;
    swV:order """${content.order}""" .`);
            }

          });

        });
        continue;
      }
      //additional triples
      if(prop === 'timestamp'){
        if(obj[prop]){
          let dt = new Date(obj[prop]) ;
          console.log(`swR:${id} swV:timestampYear "${dt.getFullYear()}" .`);
          console.log(`swR:${id} swV:timestampMonth "${dt.getMonth() + 1}" .`);
          console.log(`swR:${id} swV:timestampDay "${dt.getDate()}" .`);
          console.log(`swR:${id} swV:timestampDate "${dt.toLocaleDateString()}" .`);
        }
      }
      console.log(`swR:${id} swV:${prop} """${obj[prop] ? obj[prop] : '-'}""" .`);
    }
  }
}
