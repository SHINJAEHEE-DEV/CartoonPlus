import { readFile } from 'node:fs/promises';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');

const initials = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const normalise = (value) => value.toLowerCase().replace(/[\s\p{P}\p{S}]/gu, '');
const initial = (value) => [...value].map((c) => { const code = c.charCodeAt(0); return code >= 0xac00 && code <= 0xd7a3 ? initials[Math.floor((code - 0xac00) / 588)] : c; }).join('');
const csvLine = (line) => { const out=[]; let value='', quoted=false; for(let i=0;i<line.length;i+=1){const c=line[i]; if(c==='"'&&line[i+1]==='"'&&quoted){value+='"';i+=1;}else if(c==='"'){quoted=!quoted;}else if(c===','&&!quoted){out.push(value);value='';}else{value+=c;}} out.push(value); return out; };
const titleParts = (value) => { const m=/^(.*\S)\s+(\d+)$/u.exec(value.trim()); return m ? { title:m[1], volume:`1~${m[2]}권` } : { title:value.trim(), volume:'' }; };
const request = async (path, options={}) => { const response=await fetch(`${url}/rest/v1/${path}`, { ...options, headers:{ apikey:key, 'Content-Type':'application/json', Prefer:'resolution=merge-duplicates,return=representation', ...(options.headers ?? {}) }}); if(!response.ok) throw new Error(`${path}: ${await response.text()}`); return response.status===204 ? null : response.json(); };

const [header,...lines] = (await readFile('docs/assets/seoul_univ_2026-Sep-04_1021.csv','utf8')).trim().split(/\r?\n/);
const columns=csvLine(header);
const rows=lines.map((line)=>Object.fromEntries(columns.map((column,i)=>[column,csvLine(line)[i]??''])));
const store=(await request('stores?on_conflict=slug',{method:'POST',body:JSON.stringify({slug:'snu',name:'서울대입구역점'})}))[0];
const parsed=[...new Map(rows.filter((r)=>r.title?.trim()).map((r)=>{ const parsed={ ...r, ...titleParts(r.title) }; return [`${parsed.title}\u0000${parsed.author?.trim()??''}`,parsed]; })).values()];
const books=await request('books?on_conflict=title,author',{method:'POST',body:JSON.stringify(parsed.map((r)=>({title:r.title,author:r.author?.trim()??'',category:r.genre?.trim()??'',normalized_title:normalise(r.title),normalized_author:normalise(r.author??''),initial_consonants:initial(normalise(`${r.title}${r.author??''}`))})))});
const byKey=new Map(books.map((book)=>[`${book.title}\u0000${book.author}`,book.id]));
await request('book_inventories?on_conflict=store_id,book_id',{method:'POST',body:JSON.stringify(parsed.map((r)=>({store_id:store.id,book_id:byKey.get(`${r.title}\u0000${r.author?.trim()??''}`),volume_range:r.volume||'확인 중',shelf_location:`책장 ${r.number.trim()}번`})))});
console.log(`Imported ${parsed.length} inventory records for 서울대입구역점.`);
