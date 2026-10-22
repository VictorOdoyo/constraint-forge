/** Exact integer support for weighted equality and separable inequalities. */
export function linearSupport(c, domains, fixed, value, checkpoint, stats) {
  if (c.relation !== 'eq') {
    let bound=0n;
    for(let i=0;i<c.scope.length;i++) {
      const k=c.scope[i], weight=BigInt(c.coefficients[i]);
      let extreme;
      for(const v of k===fixed?[value]:domains.get(k)) {
        checkpoint();stats.checks++;
        const term=BigInt(v)*weight;
        if(extreme===undefined||(c.relation==='le'?term<extreme:term>extreme))extreme=term;
      }
      bound+=extreme;
    }
    return c.relation==='le'?bound<=BigInt(c.rhs):bound>=BigInt(c.rhs);
  }
  let totals=new Set([0n]);
  for(let i=0;i<c.scope.length;i++) {
    const k=c.scope[i],weight=BigInt(c.coefficients[i]),next=new Set();
    for(const total of totals)for(const v of k===fixed?[value]:domains.get(k)) {
      checkpoint();stats.checks++;next.add(total+weight*BigInt(v));
    }
    totals=next;
  }
  return totals.has(BigInt(c.rhs));
}
