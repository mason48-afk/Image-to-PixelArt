import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {dimensions,convert,palettes} from './public/pixel.mjs';
import {locales,faq} from './public/locales.mjs';
assert.deepEqual(dimensions(800,500,64),{width:64,height:40});
assert.deepEqual(dimensions(100,100,32),{width:32,height:32});
assert.equal(dimensions(1,100000,256).height,1024);
assert.throws(()=>dimensions(0,20,64));
const input=new Uint8ClampedArray([124,100,80,255,20,40,60,128,250,250,250,0]);
const original=convert(input,3,1);
assert.deepEqual([...original],[124,100,80,255,20,40,60,128,0,0,0,0]);
assert.equal(input[8],250,'must not mutate input');
for(const palette of Object.keys(palettes).filter(p=>palettes[p])){
 const output=convert(input,3,1,{palette,dither:true});
 assert.deepEqual([output[3],output[7],output[11]],[255,128,0]);
 for(const i of [0,4])assert.ok(palettes[palette].includes('#'+[...output.slice(i,i+3)].map(n=>n.toString(16).padStart(2,'0')).join('')));
 assert.deepEqual(output,convert(input,3,1,{palette,dither:true}));
}
assert.throws(()=>convert(input,4,1));
execFileSync(process.execPath,['build.mjs'],{stdio:'inherit'});
for(const lang of Object.keys(locales)){
 const html=fs.readFileSync(`dist/${lang==='en'?'':lang+'/'}index.html`,'utf8');
 assert.ok(html.includes(`lang="${lang}"`));
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.equal((html.match(/<details>/g)||[]).length,6);
 assert.equal((html.match(/hreflang=/g)||[]).length,9);
 assert.ok(/<meta name="description" content="[^"]+"/.test(html));
 assert.ok(/rel="canonical"/.test(html));
 assert.ok(!html.includes('{{'),'unresolved template');
 assert.ok(!html.includes('undefined'));
 assert.equal(faq[lang].length,6);
 assert.equal((html.match(/tag=masonp48-20/g)||[]).length,3);
 assert.ok(!html.includes('pagead/js'),'ads disabled before final domain approval');
 for(const match of html.matchAll(/(?:src|href)="(\/[^"#?]*)"/g)){
  const path='dist'+match[1]+(match[1].endsWith('/')?'index.html':'');
  assert.ok(fs.existsSync(path),`missing ${path}`);
 }
}
assert.equal((fs.readFileSync('dist/sitemap.xml','utf8').match(/<loc>/g)||[]).length,10);
assert.ok(fs.readFileSync('dist/style.css','utf8').includes('.ad-slot:empty{display:none}'));
console.log('PASS: conversion, transparency, palette colors, dimensions, 8 localized pages, links, SEO metadata, affiliate tags and ad gating.');
