#!/usr/bin/env python3
"""build.py — data/*.py 의 문구를 모아 HTML 페이지를 만든다.  python3 build.py"""
import json, importlib, html, re, datetime, sys
sys.path.insert(0,'data')
from common import *
TODAY=datetime.date.today().isoformat()
E=html.escape
def spr(who,mood,cls='',alt=''):
    return f'<img class="px {cls}" data-spr="{who}:{mood}" alt="{alt}" aria-hidden="true" width="64" height="64">'
def say(who,mood,text):
    return f'<div class="say {who}">{spr(who,mood)}<div><span class="who">{CAST[who]["label"]}</span>{text}</div></div>'
def dialog(lines,cls='dialog'):
    return f'<div class="{cls}">'+''.join(say(*l) for l in lines)+'</div>'
def nav(cur):
    items=[('index.html','목차')]+[(p['file'],p['navname']) for p in PARTS]+[('practice/index.html','실전 연습장')]
    pre='../' if cur=='practice' else ''
    return '<nav class="topnav" aria-label="시리즈 목차"><div class="wrap"><b>거리로 가르는 분류 대회</b>'+''.join(
        f'<a href="{pre}{f}" class="{"on" if f.startswith(cur) else ""}">{n}</a>' for f,n in items)+'</div></nav>'
def scoreboard(upto=None, pre=''):
    """시즌 점수판: upto 라운드까지 결과 반영(공개 전 라운드는 빼고)"""
    w={'fly':0,'robo':0,'draw':0}
    for r in ROUNDS[:upto]: w[r['win']]+=1
    mem=lambda t:''.join(spr(m,'smile') for m in TEAMS[t]['members'])
    return f'''<div class="scoreboard">
<div class="team fly">{spr('fly','smile')}<div><div class="nm">{TEAMS['fly']['name']}</div><div class="mem">{mem('fly')}</div></div><div class="pt" title="이긴 라운드">{w['fly']}승</div></div>
<div class="team robo">{spr('robo','smile')}<div><div class="nm">{TEAMS['robo']['name']}</div><div class="mem">{mem('robo')}</div></div><div class="pt" title="이긴 라운드">{w['robo']}승</div></div>
<div class="ref">{spr('doc','smile')}<div><b>심판 박사</b><br><span class="note">무승부 {w['draw']}번</span></div></div></div>'''
def cast_html():
    out='<div class="cast">'
    for k in ['doc','robo','haru','sia','moa','fly','x1','x2','x3']:
        c=CAST[k];t=c['team'];tag={'fly':'초파리 팀','robo':'주판봇 팀','ref':'심판'}[t]
        out+=f'<div class="c {t}">{spr(k,c["mood"],alt="")}<div><b>{c["label"]}</b></div><span class="tag {t}">{tag}</span><div class="r">{c["role"]}</div></div>'
    return out+'</div>'
def bigmap(cur):
    out='<div class="map">'
    for i,p in enumerate(PARTS):
        out+=f'<a href="{p["file"]}" class="{"here" if p["slug"]==cur else ""}"><div class="n">파트 {i+1} · {p["chs"]}</div><div class="t">{p["navname"]}</div><div class="d">{p["oneline"]}</div></a>'
    return out+'</div>'
def mathbox(m):
    rows=''.join(f'<tr><td class="eqc">{a}</td><td>{b}</td></tr>' for a,b in m['rows'])
    return f'''<div class="ez-math"><h3>수학 수식을 어려워하는 하루가 대신 물어봅니다</h3>
<div class="ask">{spr('haru','shock')}<p><b>하루:</b> {m['ask']}</p></div>
<p><b>학교 수학으로 보면:</b> {m['school']}</p>
<div class="eqn">{m['eq']}</div>
<div class="tbl"><table><tr><th>식 조각</th><th>읽는 법과 뜻</th></tr>{rows}</table></div>
<div class="try"><b>숫자로 한 번 해 보기</b><br>{m['try_']}</div>
<div class="ask">{spr('haru','spark')}<p><b>하루:</b> {m['comment']}</p></div></div>'''
def whybox(w,model=True):
    return f'''<div class="ez-why"><h3>왜 이 {'모델' if model else '방법'}을 쓰나</h3>
<p><b>문제 상황</b> — {w[0]}</p><p><b>앞 방법의 한계</b> — {w[1]}</p><p><b>해법</b> — <b>{w[2]}</b></p><p class="note">쉽게 말하면: {w[3]}</p></div>'''
def chapter(c,idx):
    h=f'<section class="level" id="{c["id"]}"><div class="wrap stack">'
    h+=f'<div class="lvhead"><div class="num">{c["num"]}</div><h2>{c["title"]}</h2><div class="tags">'+''.join(f'<span class="tag">{t}</span>' for t in c['tags'])+'</div></div>'
    if c.get('place'): h+=f'<p class="note">📍 {c["place"]}</p>'
    h+=dialog(c['open'])
    if c.get('review'): h+=f'<div class="review"><b>30초 복습 — {c["review"][0]}</b><br>{c["review"][1]}</div>'
    if c.get('why') or c.get('math'):
        h+='<div class="easy">'+(whybox(c['why'],c.get('model',True)) if c.get('why') else '')+(mathbox(c['math']) if c.get('math') else '')+'</div>'
    if c.get('pair'): h+=f'<div class="pair"><div><h3>일상으로 치면</h3>{c["pair"][0]}</div><div><h3>실제로는 이런 곳에</h3>{c["pair"][1]}</div></div>'
    h+=dialog(c['talk'],'dialog lvtalk')
    h+=f'<div class="panel" id="{c["id"]}-panel"><div class="ptitle">🧪 실험 — {c["panel_title"]}</div>{c["panel"]}</div>'
    if c.get('aicheck'): h+=f'<div class="aicheck"><div class="h">🤖 AI 판단 코너 — 이 결과, 그대로 믿어도 될까?</div>{c["aicheck"]}</div>'
    h+=f'<div class="explain"><h3>풀이</h3>{c["explain"]}</div>'
    if c.get('card3'): h+='<div class="three-card">'+''.join(f'<div><b>{a}</b>{b}</div>' for a,b in zip(['누구에게 묻나','무엇을 기억하나','어떤 선이 나오나'],c['card3']))+'</div>'
    if c.get('more'): h+=f'<details class="more"><summary>{c["more"][0]}</summary>{c["more"][1]}</details>'
    h+=f'<div class="limit"><b>이 챕터의 한계</b> — {c["limit"]}</div>'
    if c.get('code'): h+='<details class="code"><summary>교안의 파이썬 코드로 보면 (몰라도 됩니다)</summary><dl class="codemap">'+''.join(f'<dt>{E(a)}</dt><dd>{b}</dd>' for a,b in c['code'])+'</dl></details>'
    q=c['quiz'];h+=f'<div class="quiz" id="{c["id"]}-quiz" data-ans="{q["ans"]}" data-ok="{E(q["ok"])}" data-no="{E(q["no"])}"><div class="q">확인 퀴즈 · {q["q"]}</div><div class="opts">'+''.join(f'<button type="button">{o}</button>' for o in q['opts'])+'</div><div class="fb" aria-live="polite"></div></div>'
    return h+'</div></section>'
def battle(b):
    tf,tr=TEAMS['fly'],TEAMS['robo']
    mem=lambda t:''.join(spr(m,'smile') for m in TEAMS[t]['members'])
    return f'''<section class="sec battle" id="battle"><div class="wrap stack">
<div><div class="kicker">분류 대회 · {b['round']}</div><h2>{b['title']}</h2></div>
{dialog(b['before'])}
<div class="read"><b>경기 규칙</b><br>{b['rule']}</div>
<div class="arena" id="{b['id']}">
 <div class="side fly"><img class="px lead lead-fly" data-spr="fly:point" alt="" aria-hidden="true"><b>{tf['name']}</b><div class="mem">{mem('fly')}</div><div>{b['fly']}</div><div class="score sc-fly">?</div></div>
 <div class="vs">VS</div>
 <div class="side robo"><img class="px lead lead-robo" data-spr="robo:firm" alt="" aria-hidden="true"><b>{tr['name']}</b><div class="mem">{mem('robo')}</div><div>{b['robo']}</div><div class="score sc-robo">?</div></div>
 <div class="judge"><img class="px lead-doc" data-spr="doc:think" alt="" aria-hidden="true"><div class="predict"><b>먼저 골라 보세요:</b><button type="button" data-p="fly">초파리 팀</button><button type="button" data-p="robo">주판봇 팀</button><button type="button" data-p="draw">무승부</button></div><button class="go open" type="button">심판 박사: 결과 열기</button></div>
</div>
<p class="predres note" aria-live="polite"></p><p class="note">결과를 열기 전에 어느 팀이 이길지 먼저 맞혀 보세요. 점수는 이 페이지가 직접 계산합니다(처음 보는 시험 데이터 {b['ntest']}명 기준). 운동장 데이터는 두 방법의 차이가 잘 보이도록 만든 교육용 예시라, 다른 데이터에서는 승패가 달라질 수 있어요.</p>
<div class="after hidden stack">{dialog(b['after'])}<div class="verdict">{b['verdict']}</div></div>
</div></section>'''
def kg_section(P,nodes,edges):
    return f'''<section class="sec" id="kg"><div class="wrap stack"><div><div class="kicker">지식 색인</div><h2>이 페이지에 나온 개념 지도</h2>
<p class="note">항목을 누르면 본문의 그 자리로 갑니다. 개념 {len(nodes)}개, 관계 {len(edges)}개.</p></div>
<div class="kgwrap" id="kg-list"></div><details id="kg-edges" class="kgedges"></details></div></section>'''
def export_section(P):
    return f'''<section class="sec" id="export"><div class="wrap stack"><div><div class="kicker">꾸러미</div><h2>내려받기 — 개념 지도·참고 자료·페이지 정보</h2>
<p class="note">다른 도구(온톨로지 편집기, 문헌 관리기)로 옮길 때 씁니다. 같은 파일이 저장소 <code>kg/</code> 폴더에도 있습니다.</p></div>
<div class="btns"><button data-dl="kg-raw" data-name="{P['slug']}.kg.json">개념 지도 (kg.json)</button><button data-dl="kg-ld" data-name="{P['slug']}.jsonld">연결 데이터 (JSON-LD)</button><button data-dl="refs-csl" data-name="{P['slug']}.refs.json">참고 자료 (CSL-JSON)</button><button data-dl="page-meta" data-name="{P['slug']}.meta.json">페이지 정보</button></div>
<div class="say haru">{spr('haru','smile')}<div><span class="who">하루</span>참고 자료 목록도 꾸러미에 넣어 두었어요. 인포그래픽 원본 출처와 처음 제안된 논문들이에요.</div></div>
<div class="tbl"><table><tr><th>참고 자료</th><th>쓰인 곳</th></tr>{''.join(f"<tr><td>{r['cite']}</td><td>{r['use']}</td></tr>" for r in P['refs'])}</table></div></div></section>'''
def jsonld(P,nodes,edges):
    g=[{'@id':n['id'],'@type':'lab:'+n['type'],'name':n['label']['ko'],**({'description':n['definition']['ko']} if n.get('definition') else {})} for n in nodes]
    return {'@context':{'lab':'https://adminmrobo.github.io/knn_svc_svm_lab/ns#','name':'http://schema.org/name','description':'http://schema.org/description'},'@graph':g,
            'lab:edges':[{'s':e['s'],'p':e['p'],'o':e['o']} for e in edges]}
def build_kg(P):
    nodes=[];edges=[]
    for (i,t,ko,en,anchor,lv,df,fam) in P['nodes']:
        n={'id':i,'type':t,'label':{'ko':ko,'en':en},'page':P['slug'],'anchor':anchor,'level':lv,'status':'known','confidence':'high','coverage':'explained','family':fam,'match':[],'domain':['ai']}
        if df: n['definition']={'ko':df}
        nodes.append(n)
    for c in P['chapters']:
        nodes.append({'id':f"lab:simulation/{P['slug']}-{c['id']}",'type':'Simulation','label':{'ko':c['panel_title'],'en':c['id']+' experiment'},'page':P['slug'],'anchor':'#'+c['id']+'-panel','level':1,'status':'known','confidence':'high','coverage':'explained','match':[]})
        nodes.append({'id':f"lab:quiz/{P['slug']}-{c['id']}-1",'type':'QuizItem','label':{'ko':c['quiz']['q'],'en':c['id']+' quiz'},'page':P['slug'],'anchor':'#'+c['id']+'-quiz','level':1,'status':'known','confidence':'high','coverage':'explained','match':[]})
        edges.append({'s':c['concept'],'p':'lab:demonstratedBy','o':f"lab:simulation/{P['slug']}-{c['id']}",'anchor':'#'+c['id']+'-panel','confidence':'high'})
        edges.append({'s':f"lab:quiz/{P['slug']}-{c['id']}-1",'p':'lab:assesses','o':c['concept'],'anchor':'#'+c['id']+'-quiz','confidence':'high'})
    for r in P['refs']:
        nodes.append({'id':'lab:work/'+r['id'],'type':'Work','label':{'ko':r['short'],'en':r['csl']['title']},'page':P['slug'],'anchor':'#export','level':2,'status':'known','confidence':'high','coverage':'explained','match':[]})
    for (s,p,o,a) in P['edges']: edges.append({'s':s,'p':p,'o':o,'anchor':a,'confidence':'high'})
    ids={n['id'] for n in nodes}
    for e in edges:
        assert e['s'] in ids or e['o'] in ids, e   # 한쪽 끝은 이 페이지 노드(다른 끝은 앞 파트 노드나 뼈대 주제)
    refs=[dict(r['csl'],id=r['id'],lab={'work':'lab:work/'+r['id'],'role':r['role'],'supports':[],'locs':[],'verified':r['verified'],'checkedBy':r['checked'],'checkedSource':'author-memory' if 'arXiv' not in r['checked'] else 'web'}) for r in P['refs']]
    meta={'title':P['title'],'number':P['num'],'series':SERIES,'about':P['about'],'basedOn':[r['id'] for r in P['refs'] if r['role']=='primary'],'educationalLevel':'입문',
          'creator':[{'name':AUTHOR,'role':'author','url':AUTHOR_URL}],'contributor':[{'name':'AI 보조 제작','role':'assistant'}],'date':TODAY,'version':'1.0','language':['ko'],'license':'','url':SITE+P['file'],
          'registry':'KG_00_registry 0.2','learningResourceType':'interactive explainer','seeAlso':'','suggestedCitation':f"{AUTHOR} ({TODAY[:4]}). {P['title']}. {SERIES} {P['num']}, v1.0."}
    kgd={'version':'1.0','page':P['slug'],'nodes':nodes,'edges':edges}
    for nm,obj in [('kg',kgd),('refs',refs),('meta',meta)]:
        json.dump(obj,open(f"kg/{P['slug']}.{nm}.json",'w'),ensure_ascii=False,indent=1)
    return kgd,refs,meta
def head(P,pre=''):
    ld={'@context':'https://schema.org','@type':'LearningResource','name':P['title'],'description':P['desc'],'inLanguage':'ko','educationalLevel':'입문',
        'creator':{'@type':'Person','name':AUTHOR,'url':AUTHOR_URL,'affiliation':AFFIL},'isPartOf':SERIES,'url':SITE+P['file']}
    return f'''<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{E(P['title'])} · {SERIES}</title><meta name="description" content="{E(P['desc'])}"><meta name="author" content="{AUTHOR}">
<meta property="og:title" content="{E(P['title'])}"><meta property="og:description" content="{E(P['desc'])}"><meta property="og:type" content="article">
<meta property="og:image" content="{SITE}{P['og']}"><meta property="og:url" content="{SITE}{P['file']}"><meta name="twitter:card" content="summary_large_image">
<meta name="citation_title" content="{E(P['title'])}"><meta name="citation_author" content="{AUTHOR}"><meta name="citation_publication_date" content="{TODAY.replace('-','/')}">
<link rel="stylesheet" href="{pre}assets/engine.css?v=2"><script type="application/ld+json">{json.dumps(ld,ensure_ascii=False)}</script></head><body>'''
def footer(P,pre=''):
    return f'''<footer><div class="wrap stack" style="gap:16px">{P.get('nextprev','')}
<p>글 · {AUTHOR} (<a href="{AUTHOR_URL}">{AUTHOR_URL}</a>) · {AFFIL}</p>
<p class="note">숫자는 모두 이 페이지가 만든 교육용 예시 데이터로 계산했습니다. 캐릭터와 그림은 코드로 그린 픽셀아트입니다.</p></div></footer>
<script src="{pre}assets/sprites.js"></script><script src="{pre}assets/ml.js"></script><script src="{pre}assets/data.js"></script><script src="{pre}assets/engine.js"></script>'''
def page(P,idx):
    kgd,refs,meta=build_kg(P)
    h=head(P)+nav(P['file'])
    h+=f'<figure class="cover"><img src="{P["cover"]}" alt="{E(P["cover_alt"])}" width="1920" height="1080"></figure>'
    h+=f'<header class="hero" id="top"><div class="wrap"><div class="kicker">{SERIES} · {P["num"]}</div><h1>{P["title"]}</h1><p class="sub">{P["sub"]}</p>{scoreboard(idx)}<div style="margin-top:24px">{dialog(P["hero"])}</div></div></header>'
    w,y,u=P['plain']
    h+=f'''<section class="sec" id="plain"><div class="wrap stack"><h2>처음 오신 분께 — 이 페이지를 3줄로</h2>
<div class="three"><div><b>무엇을</b>{w}</div><div><b>왜 중요한가</b>{y}</div><div><b>실제로는</b>{u}</div></div>
<p class="note">코드나 수식을 몰라도 됩니다. 그림을 움직이고, 작은 숫자로 한 번씩 같이 계산하면 충분해요.</p>
<details class="abbr"><summary>이 페이지에 나오는 영어 약어 풀이</summary><dl class="abbr">{''.join(f"<dt>{a}</dt><dd><b>{ABBR[a][0]}</b> — {ABBR[a][1]}</dd>" for a in P['abbr'])}</dl></details></div></section>'''
    h+=f'<section class="sec" id="cast"><div class="wrap stack"><h2>등장인물</h2>{cast_html()}</div></section>'
    h+=f'<section class="sec" id="why"><div class="wrap stack"><h2>왜 이 파트를 배우나</h2>{P["why"]}</div></section>'
    h+=f'<section class="sec" id="map"><div class="wrap stack"><h2>큰 그림 — 지금 어디쯤?</h2>{bigmap(P["slug"])}<p>{P["where"]}</p></div></section>'
    for i,c in enumerate(P['chapters']): h+=chapter(c,i)
    h+=battle(P['battle'])
    if P.get('exam'):
        h+=f'<section class="sec" id="exam"><div class="wrap stack"><div><div class="kicker">{P["num"]} 쪽지시험</div><h2>박사의 쪽지시험 — 5문항</h2><p class="note">처음 고른 답으로 채점해요. 틀려도 다시 눌러 해설을 볼 수 있어요. 기록은 저장하지 않습니다.</p></div>'
        h+=dialog([('doc','smile','계산기는 필요 없어요. 작은 숫자로 손계산 한 번이면 됩니다. 막히면 문항 아래 해설과 챕터 링크를 보세요.')])
        h+='<div class="exam">'+''.join(f'<div class="quiz" id="exam-{i+1}" data-ans="{q["ans"]}" data-ok="{E(q["ok"])}" data-no="{E(q["no"])}" data-ref="{q["ref"]}" data-refname="{E(q["refname"])}"><div class="q">{i+1}. {q["q"]}</div><div class="opts">'+''.join(f'<button type="button">{o}</button>' for o in q['opts'])+f'</div><div class="fb" aria-live="polite"></div><div class="note">관련: <a href="{q["ref"]}">{q["refname"]}</a></div></div>' for i,q in enumerate(P['exam']))
        h+='<p class="exam-score" aria-live="polite">아직 푼 문항이 없어요.</p></div></div></section>'
    h+=f'<section class="sec" id="summary"><div class="wrap stack"><h2>정리</h2>{P["summary"]}</div></section>'
    h+=f'<section class="sec" id="outro"><div class="wrap stack"><h2>아웃트로</h2>{dialog(P["outro"])}</div></section>'
    h+=kg_section(P,kgd['nodes'],kgd['edges'])+export_section(P)
    h+=f'<script type="application/json" id="kg-raw">{json.dumps(kgd,ensure_ascii=False)}</script><script type="application/ld+json" id="kg-ld">{json.dumps(jsonld(P,kgd["nodes"],kgd["edges"]),ensure_ascii=False)}</script>'
    h+=f'<script type="application/json" id="refs-csl">{json.dumps(refs,ensure_ascii=False)}</script><script type="application/json" id="page-meta">{json.dumps(meta,ensure_ascii=False)}</script>'
    w={'fly':0,'robo':0,'draw':0}
    for r in ROUNDS[:idx]: w[r['win']]+=1
    h+=f'<div class="floatscore" id="floatscore" data-fly="{w["fly"]}" data-robo="{w["robo"]}" aria-live="polite"><span class="f">초파리 팀 <b class="fs-fly">{w["fly"]}</b></span><span class="r">주판봇 팀 <b class="fs-robo">{w["robo"]}</b></span><span>내 예측 <b class="fs-me">0/0</b></span></div>'
    h+=footer(P)+f'<script src="{P["js"]}"></script></body></html>'
    open(P['file'],'w').write(h)
    return len(kgd['nodes']),len(kgd['edges'])
if __name__=='__main__':
    for i,p in enumerate(PARTS):
        try: m=importlib.import_module(p['slug'])
        except ModuleNotFoundError: print('skip',p['slug']); continue
        P=dict(p,**m.PAGE)
        print(P['file'],page(P,i))
    import index_page; index_page.build(globals())
    import practice_page; practice_page.build(globals())
    # 그림 주소에 내용 해시를 붙여, 그림을 바꾸면 브라우저·공유 미리보기가 옛 그림을 다시 쓰지 않게 한다
    import hashlib,glob as _g
    def _v2(m):
        f=m.group(2);h=hashlib.md5(open(f.replace('../','') ,'rb').read()).hexdigest()[:8]
        return f'{m.group(1)}{f}?v={h}'
    def _v(m):
        f=m.group(2);h=hashlib.md5(open(f,'rb').read()).hexdigest()[:8]
        return f'{m.group(1)}{f}?v={h}'
    for fn in ['index.html','practice/index.html']+[p['file'] for p in PARTS]:
        t=open(fn).read()
        # 웹피를 못 여는 브라우저를 위해 PNG(2배) 대체 그림
        t=re.sub(r'<img src="((?:\.\./)?)assets/img/(cover_[a-z0-9]+)\.webp(?:\?v=[0-9a-f]+)?"',lambda m:f'<picture><source type="image/webp" srcset="{m.group(1)}assets/img/{m.group(2)}.webp"><img src="{m.group(1)}assets/img/{m.group(2)}.png"',t)
        t=re.sub(r'(<picture>.*?<img [^>]*>)(?!</picture>)',r'\1</picture>',t,flags=re.S)
        t=re.sub(r'(srcset="|src="(?:\.\./)?|content="'+re.escape(SITE)+r')((?:\.\./)?assets/img/[a-z0-9_]+\.(?:webp|png))(?:\?v=[0-9a-f]+)?',lambda m:_v2(m),t)
        open(fn,'w').write(t);continue
        t=re.sub(r'(src="(?:\.\./)?|content="'+re.escape(SITE)+r')(assets/img/[a-z0-9_]+\.webp)(?:\?v=[0-9a-f]+)?',_v,t);open(fn,'w').write(t)
