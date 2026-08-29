import{c as u}from"./createLucideIcon-BnfxkjeL.js";import{r as l}from"./app-DHeYXV9c.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]],y=u("Upload",d);function h(c){const[r,s]=l.useState([]),m=(t,o)=>{s(n=>{const e=[...n],a=t+o;return a<0||a>=e.length?n:([e[t],e[a]]=[e[a],e[t]],e)})};l.useEffect(()=>{const t=Array.from(c??[]);s(t.map(o=>({name:o.name,alt:""})))},[c]);const p=(t,o)=>{s(n=>{const e=[...n];return e[t]={...e[t],alt:o},e})},i=r.length>0&&r.every(t=>t.alt.trim().length>0);return{imageAlts:r,setAlt:p,allCompleted:i,moveImage:m}}export{y as U,h as u};
