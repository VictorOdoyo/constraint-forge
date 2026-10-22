import test from 'node:test';import assert from 'node:assert/strict';
import {corpus,runCase} from '../bench/corpus.js';
test('release corpus completes with valid assignments and expected counts',()=>{
 for(const entry of corpus()){const stats=runCase(entry);assert.ok(stats.nodes<=entry.maxNodes,entry.name);}
});
