export function countValue(model,scope,value,countVariable) {
 return model.constrain([...scope,countVariable],(...v)=>v.slice(0,-1).filter(x=>x===value).length===v.at(-1),'count-value');
}