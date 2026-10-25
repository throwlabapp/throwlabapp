from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
from html import unescape
import re,json,xml.etree.ElementTree as E
root=Path(__file__).resolve().parents[1];p=root/'public'
# Validate markup, referenced local files and fragment IDs for every page.
void={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
class Scan(HTMLParser):
 def __init__(self):super().__init__();self.stack=[];self.refs=[];self.ids=[];self.h1=0
 def handle_starttag(self,t,attrs):
  d=dict(attrs)
  if t not in void:self.stack.append(t)
  if 'id' in d:self.ids.append(d['id'])
  if t=='h1':self.h1+=1
  for k in ['src','href']:
   if k in d:self.refs.append(d[k])
 def handle_startendtag(self,t,a):pass
 def handle_endtag(self,t):
  assert self.stack and self.stack[-1]==t,(t,self.stack[-5:]);self.stack.pop()
scans={};files=list(p.rglob('*.html'))
for f in files:
 c=Scan();c.feed(f.read_text());assert not c.stack,(f,c.stack);assert len(c.ids)==len(set(c.ids)),f
 scans[f]=c
errors=[]
for f,c in scans.items():
 for raw in c.refs:
  u=urlsplit(raw)
  if u.scheme or u.netloc:continue
  target=(p/u.path.lstrip('/') if u.path.startswith('/') else f.parent/u.path) if u.path else f
  target=target.resolve()
  if target.is_dir():target=target/'index.html'
  if not target.exists():errors.append((str(f.relative_to(p)),raw))
  elif u.fragment and target in scans and unquote(u.fragment) not in scans[target].ids:errors.append((str(f.relative_to(p)),raw))
assert not errors,errors
s=(p/'index.html').read_text();payloads=[json.loads(v) for v in re.findall(r'<script type="application/ld\+json">(.*?)</script>',s,re.S)]
faq=next(x for x in payloads if x['@type']=='FAQPage');sec=re.search('<div class="faq">(.*?)</div></div>',s,re.S)[1]
visible=[(unescape(q).strip(),unescape(v).strip()) for q,v in re.findall('<details><summary>(.*?)</summary><p>(.*?)</p></details>',sec,re.S)]
assert visible==[(q['name'],q['acceptedAnswer']['text']) for q in faq['mainEntity']]
for f in (p/'assets').glob('*.svg'):E.parse(f)
data=json.loads((root/'GRAPHICS_SAMPLE_DATA.json').read_text())
assert all(len(v)==10 for v in data.values())
assert round(sum(data['speed'][:-1])/9)==55 and data['speed'][-1]==59
assert sum(data['bank'][:-1])/9==-1 and data['bank'][-1]==1
assert sum(data['path'][:-1])/9==3 and data['path'][-1]==2
assert '8° flat' in (p/'assets/Flight_Analysis-phone.svg').read_text()
assert '8° down' not in (p/'assets/Flight_Analysis-phone.svg').read_text()
assert not re.search(r'\d+ ft', (p/'assets/Sessions-phone.svg').read_text())
assert '120 fps' not in ''.join(f.read_text() for f in files)
assert scans[p/'index.html'].h1==1
print(json.dumps({'html_pages':len(files),'local_references':'passed','faq_answers':len(visible),'faq_schema_matches':True,'svg_xml':'passed','sample_cohort_arithmetic':'passed','flight_only_sessions':True,'frame_rate_copy':'240 fps','single_homepage_h1':True},indent=2))
