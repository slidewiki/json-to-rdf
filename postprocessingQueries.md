# post-processing SPARQL queries

```
INSERT {
GRAPH <https://slidewiki.org> {
?s rdfs:label ?label  .
}
} WHERE {
GRAPH <https://slidewiki.org> {
?s <http://rdf.slidewiki.org/vocab/username> ?label .
}
}
```
```
INSERT {
GRAPH <https://slidewiki.org> {
?s rdfs:label ?label  .
}
} WHERE {
GRAPH <https://slidewiki.org> {
?s <http://rdf.slidewiki.org/vocab/title> ?label .
}
}
```
```
INSERT {
GRAPH <https://slidewiki.org> {
?s rdfs:label ?title .
}
} WHERE {
GRAPH <https://slidewiki.org> {
?s <http://rdf.slidewiki.org/vocab/isEqualTo> ?v .
?v <http://rdf.slidewiki.org/vocab/title> ?title .
}
}
```
```
INSERT {
GRAPH <https://slidewiki.org> {
?v <http://rdf.slidewiki.org/vocab/isRevisedFrom> ?s
}
} WHERE {
GRAPH <https://slidewiki.org> {
?s <http://rdf.slidewiki.org/vocab/hasRevision> ?v .

}
}
```
```
INSERT {
GRAPH <https://slidewiki.org> {
?uname <http://rdf.slidewiki.org/vocab/hasCreated> ?s.
}
} WHERE {
GRAPH <https://slidewiki.org> {
?s a <http://rdf.slidewiki.org/vocab/Deck> ; <http://purl.org/net/provenance/ns#createdBy> ?uname .
}
}
```
```
INSERT {
GRAPH <https://slidewiki.org> {
?s <http://rdf.slidewiki.org/vocab/relatedSlide> ?rt .
}
} WHERE {
GRAPH <https://slidewiki.org> {
?s <http://rdf.slidewiki.org/vocab/related_object> ?ro .
?s <http://rdf.slidewiki.org/vocab/relatedTo> ?rt .
FILTER(?ro="slide")

}
}
```
```
INSERT {
GRAPH <https://slidewiki.org> {
?s <http://rdf.slidewiki.org/vocab/relatedDeck> ?rt .
}
} WHERE {
GRAPH <https://slidewiki.org> {
?s <http://rdf.slidewiki.org/vocab/related_object> ?ro .
?s <http://rdf.slidewiki.org/vocab/relatedTo> ?rt .
FILTER(?ro="deck")

}
}
```
