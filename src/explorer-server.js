import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

export function createExplorerServer({root=fileURLToPath(new URL('../',import.meta.url))}={}) {
 const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json'};
 return createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-store');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; worker-src 'self'; img-src 'self' data: blob:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'");
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return;}
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end('Malformed URL');return;}
  if(pathname==='/')pathname='/web/index.html';
  if(!/^\/(web|src)\//.test(pathname)){res.writeHead(404);res.end('Not found');return;}
  const file=path.resolve(root,'.'+pathname),relative=path.relative(root,file);
  if(relative.startsWith('..')||path.isAbsolute(relative)||!['web','src'].includes(relative.split(path.sep)[0])){res.writeHead(403);res.end('Forbidden');return;}
  const type=types[path.extname(file)];if(!type){res.writeHead(404);res.end('Not found');return;}
  try{const body=await readFile(file);res.writeHead(200,{'Content-Type':type});res.end(req.method==='HEAD'?undefined:body);}
  catch{res.writeHead(404);res.end('Not found');}
 });
}
