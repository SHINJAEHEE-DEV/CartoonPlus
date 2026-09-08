import { useState } from 'react';
import { validateInventoryCsv } from '../../lib/inventoryImport';
import { parseBaselineInventory } from '../../lib/inventoryCsv';
import { supabase } from '../../lib/supabase';

export function InventoryPage() {
  const [message, setMessage] = useState('');
  const save = async (form: FormData) => { const { error } = await supabase!.rpc('upsert_inventory', { p_title: String(form.get('title')), p_author: String(form.get('author')), p_category: String(form.get('category')), p_volume_range: String(form.get('volume')), p_shelf_location: String(form.get('shelf')) }); setMessage(error?.message ?? '재고를 저장했습니다.'); };
  const importCsv = async (file: File) => { const text = await file.text(); const validation = validateInventoryCsv(text); if (validation) return setMessage(validation); let done = 0; for (const book of parseBaselineInventory(text)) { const { error } = await supabase!.rpc('upsert_inventory', { p_title: book.title, p_author: book.author, p_category: book.category, p_volume_range: book.volumeRange || '확인 중', p_shelf_location: book.shelfLocation }); if (error) return setMessage(error.message); done += 1; } setMessage(`${done}개 재고를 추가하거나 갱신했습니다. 기존에만 있던 재고는 유지됩니다.`); };
  const archive = async (form: FormData) => { const archived = form.get('action') === 'archive'; const { error } = await supabase!.rpc('set_inventory_archive', { p_inventory_id: String(form.get('id')), p_archived: archived }); setMessage(error?.message ?? (archived ? '재고를 보관했습니다.' : '재고를 복구했습니다.')); };
  return <main className="app-notice"><h1>도서 재고 관리</h1><form onSubmit={(e) => { e.preventDefault(); void save(new FormData(e.currentTarget)); }}><input name="title" placeholder="도서명" required /><input name="author" placeholder="작가" /><input name="category" placeholder="장르" /><input name="volume" placeholder="보유 권수" required /><input name="shelf" placeholder="서가 위치" required /><button>저장</button></form><label>CSV 가져오기 <input type="file" accept=".csv,text/csv" onChange={(e) => { const file = e.target.files?.[0]; if (file) void importCsv(file); }} /></label><form onSubmit={(e) => { e.preventDefault(); void archive(new FormData(e.currentTarget)); }}><input name="id" placeholder="재고 ID" required /><select name="action"><option value="archive">보관</option><option value="restore">복구</option></select><button>적용</button></form><p>{message}</p></main>;
}
