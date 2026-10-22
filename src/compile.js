/** Compile immutable topology once per solve rather than at every search node. */
export function compile(domains, constraints) {
 const incident = new Map([...domains.keys()].map(k=>[k,[]]));
 constraints.forEach((c,i)=>c.scope.forEach(k=>incident.get(k).push(i)));
 return { incident, degree: new Map([...incident].map(([k,v])=>[k,v.length])) };
}
