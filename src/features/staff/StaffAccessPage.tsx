import { useState } from 'react';
import { applyForStaff, signInStaff } from './staffAuth';

export function StaffAccessPage() {
  const [mode, setMode] = useState<'login'|'signup'>('login');
  const [message, setMessage] = useState('');
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form=new FormData(event.currentTarget);
    try { if(mode==='signup') { await applyForStaff({name:String(form.get('name')),loginId:String(form.get('loginId')),password:String(form.get('password')),phoneLast4:String(form.get('phoneLast4'))}); setMessage('가입 신청이 접수되었습니다. 관리자 승인 후 로그인할 수 있습니다.'); }
    else { await signInStaff(String(form.get('loginId')),String(form.get('password'))); setMessage('로그인되었습니다.'); } } catch(error) { setMessage(error instanceof Error ? error.message : '처리에 실패했습니다.'); }
  }
  return <main className="app-notice"><p className="eyebrow">직원 전용</p><h1>{mode==='login'?'직원 로그인':'직원 가입 신청'}</h1><form onSubmit={submit}><input name="name" placeholder="이름" required={mode==='signup'} hidden={mode==='login'}/><input name="loginId" placeholder="로그인 아이디" required/><input name="password" type="password" placeholder="비밀번호 (8자 이상)" required/><input name="phoneLast4" placeholder="전화번호 끝 4자리" required={mode==='signup'} hidden={mode==='login'}/><button type="submit">{mode==='login'?'로그인':'가입 신청'}</button></form><p>{message}</p><button onClick={()=>setMode(mode==='login'?'signup':'login')}>{mode==='login'?'직원 가입 신청':'로그인으로 돌아가기'}</button></main>;
}
