export const palettes = {
  original: null,
  pocket: ['#0f380f','#306230','#8bac0f','#9bbc0f'],
  dusk: ['#211e3b','#4b3f72','#9467a4','#cf8ba9','#f4baa2','#ffe4bb','#7fbdc1','#426f8a'],
  arcade: ['#140c1c','#442434','#30346d','#4e4a4e','#854c30','#346524','#d04648','#757161','#597dce','#d27d2c','#8595a1','#6daa2c','#d2aa99','#6dc2ca','#dad45e','#deeed6'],
  mono: ['#182124','#f5f3eb']
};
export function dimensions(w,h,columns){
 if(!Number.isFinite(w)||!Number.isFinite(h)||w<=0||h<=0)throw Error('Invalid image dimensions');
 const width=Math.max(8,Math.min(256,Math.round(Number(columns)||64)));
 return {width,height:Math.max(1,Math.min(1024,Math.round(h/w*width)))};
}
export function convert(data,width,height,{palette='original',dither=false,contrast=0}={}){
 if(data.length!==width*height*4)throw Error('Invalid pixel data');
 const out=new Uint8ClampedArray(data),colors=palettes[palette];
 const rgb=colors?.map(h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)));
 const factor=(259*(Number(contrast)+255))/(255*(259-Number(contrast)));
 const matrix=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
 for(let i=0;i<out.length;i+=4){
  if(!out[i+3]){out[i]=out[i+1]=out[i+2]=0;continue;}
  const x=i/4%width,y=Math.floor(i/4/width),bias=dither&&rgb?(matrix[y%4][x%4]-7.5)*3:0;
  let c=[0,1,2].map(k=>Math.max(0,Math.min(255,factor*(out[i+k]-128)+128+bias)));
  if(rgb){let distance=Infinity,best=rgb[0];for(const p of rgb){const d=c.reduce((v,n,k)=>v+(n-p[k])**2,0);if(d<distance){distance=d;best=p;}}c=best;}
  for(let k=0;k<3;k++)out[i+k]=c[k];
 }
 return out;
}
