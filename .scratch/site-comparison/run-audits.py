import json, os, subprocess, time
from pathlib import Path
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'reports'
OUT.mkdir(exist_ok=True)
CLI=Path(os.environ['LOCALAPPDATA'])/'npm-cache/_npx/ed05d372d6adb15e/node_modules/lighthouse/cli/index.js'
env=dict(os.environ,CHROME_PATH='C:/Program Files/Google/Chrome/Application/chrome.exe')
targets={'old-menu':'https://cartoonplus-gangnam.imweb.me/16','new-menu':'https://cartoonplus.pages.dev/#/menu','old-search':'https://cartoonplus-gangnam.imweb.me/18','new-search':'https://cartoonplus.pages.dev/#/books','old-home':'https://cartoonplus-gangnam.imweb.me/','new-home':'https://cartoonplus.pages.dev/'}
for page, repeats in [('menu',3),('search',1),('home',1)]:
 for device in ['mobile','desktop']:
  for repeat in range(1,repeats+1):
   for site in ['old','new']:
    label=f'{site}-{page}-{device}-{repeat}'
    report=OUT/(label+'.report.json')
    if report.exists():
     print('SKIP '+label,flush=True);continue
    cmd=['node',str(CLI),targets[f'{site}-{page}'],'--only-categories=performance,accessibility,best-practices,seo','--chrome-flags=--headless --disable-gpu','--output=json','--output=html','--output-path='+str(OUT/label),'--quiet']
    if device=='desktop':cmd+=['--preset=desktop']
    print('START '+label,flush=True)
    try:
     with (OUT/(label+'.log')).open('w',encoding='utf-8') as log:
      result=subprocess.run(cmd,env=env,stdout=log,stderr=subprocess.STDOUT,timeout=240)
     if report.exists():
      r=json.loads(report.read_text(encoding='utf-8'))
      print(json.dumps({'label':label,'score':r['categories']['performance']['score'],'lcp':r['audits']['largest-contentful-paint'].get('numericValue'),'error':r.get('runtimeError'),'exit':result.returncode}),flush=True)
     else:print('NO_REPORT '+label,flush=True)
    except subprocess.TimeoutExpired:print('TIMEOUT '+label,flush=True)
