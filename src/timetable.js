/** Compulsory-part resource filtering. Sound but weaker than full GAC. */
export function timetableSupport(c,domains,fixed,value,checkpoint,stats) {
  const intervals=[];
  for(let i=0;i<c.scope.length;i++) {
    checkpoint();
    if(c.durations[i]===0||c.demands[i]===0)continue;
    if(c.demands[i]>c.capacity)return false;
    const values=c.scope[i]===fixed?[value]:domains.get(c.scope[i]);
    const latest=values.reduce((a,b)=>Math.max(a,b),-Infinity);
    const earliest=values.reduce((a,b)=>Math.min(a,b),Infinity);
    if(latest<earliest+c.durations[i])intervals.push({start:latest,end:earliest+c.durations[i],demand:c.demands[i]});
  }
  for(const {start} of intervals) {
    checkpoint();stats.checks++;
    const load=intervals.reduce((s,i)=>s+(i.start<=start&&start<i.end?i.demand:0),0);
    if(load>c.capacity)return false;
  }
  return true;
}
