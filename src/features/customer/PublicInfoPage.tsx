import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export function PublicInfoPage({kind}:{kind:'games'|'events'|'store'}){
  const [managed,setManaged]=useState<string|null>(null); const [error,setError]=useState(false);
  const content=kind==='games'?['게임 목록','현재 공개된 게임이 없습니다. 확인된 목록만 안내합니다.']:kind==='events'?['이벤트·공지','진행 중인 이벤트가 없습니다.']:['매장 안내','서울특별시 관악구 관악로 155, 3층 · 매일 10:00~23:00 · 02-888-0852'];
  useEffect(()=>{if(!supabase){setManaged('');return} const today=new Date().toISOString().slice(0,10); const query=kind==='store'?supabase.from('store_content').select('content_value').eq('content_key','store').maybeSingle():kind==='games'?supabase.from('entertainment_items').select('title,players,genre').eq('is_verified',true).eq('is_available',true):supabase.from('store_events').select('title,content').eq('is_public',true).gte('end_date',today); void query.then(({data,error})=>{if(error){setError(true);return} if(kind==='store')setManaged((data as {content_value?:{text?:string}}|null)?.content_value?.text??''); else setManaged(((data??[]) as {title:string;players?:string;genre?:string;content?:string}[]).map(x=>kind==='games'?`${x.title} · ${x.players??''} · ${x.genre??''}`:`${x.title}\n${x.content??''}`).join('\n\n'))});},[kind]);
  return <main className="app-notice"><h1>{content[0]}</h1>{kind==='events'&&<section><strong>매장 이용 안내</strong><p>이벤트와 매장 운영 정보는 카운터 안내를 함께 확인해 주세요.</p></section>}<p style={{whiteSpace:'pre-line'}}>{error?'정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.':managed===null?'정보를 불러오는 중입니다.':managed||content[1]}</p><a href="/">홈으로 돌아가기</a></main>;
}
