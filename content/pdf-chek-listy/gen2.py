import html, base64, re, sys, json
E=html.escape
U='https://www.mayak-legal.ru'
def u(path,c,camp): return f'{U}{path}?utm_source=checklist&utm_medium=pdf&utm_campaign={camp}&utm_content={c}'
SRC=open('/tmp/claude-0/cl/cl.html',encoding='utf-8').read()
STYLE=re.search(r'<style>(.*?)</style>',SRC,re.S).group(1)
STYLE=STYLE.replace('url(onest-','url(/tmp/claude-0/cl/onest-')
LOGO=base64.b64encode(open('/tmp/claude-0/cl/logo.png','rb').read()).decode()
N=' '
def nb(s): return re.sub(r'(\d) (\d{3}) ₽',lambda m:m.group(1)+N+m.group(2)+N+'₽',re.sub(r'(\d) ₽',lambda m:m.group(1)+N+'₽',s))
def promo(p,camp):
    t,text,price,path,c,btn=p
    return f'<a class="promo" href="{u(path,c,camp)}"><div class="pr-l"><div class="pr-k">Маяк поможет</div><div class="pr-t">{E(t)}</div><div class="pr-d">{E(nb(text))}</div></div><div class="pr-r"><div class="pr-p">{E(nb(price))}</div><div class="pr-b">{E(btn)} →</div></div></a>'
def qcard(i,q):
    t,body,warn=q
    w=f'<div class="warn"><b>Насторожит:</b> {E(warn)}</div>' if warn else ''
    return f'<div class="q"><div class="qn">{i}</div><div class="qb"><h3>{E(t)}</h3><p>{E(nb(body))}</p>{w}</div></div>'
def dsec(sec):
    t,lead,items=sec
    cls='dg two' if len(items)>3 else 'dg'
    li=''.join(f'<div class="d"><span class="cb"></span><div><b>{E(a)}</b><span>{E(nb(b))}</span></div></div>' for a,b in items)
    return f'<h3 class="dh">{E(t)}</h3>'+(f'<p class="dl">{E(lead)}</p>' if lead else '')+f'<div class="{cls}">{li}</div>'
def build(S,out):
    camp=S['camp']; body=[]
    for blk in S['blocks']:
        k=blk[0]
        if k=='h2': body.append(f'<h2>{E(blk[1])}</h2>')
        elif k=='lead': body.append(f'<p class="lead" style="font-size:9.6pt">{E(nb(blk[1]))}</p>')
        elif k=='note': body.append(f'<div class="note"><b>{E(blk[1])}</b> {E(nb(blk[2]))}</div>')
        elif k=='qs':
            start=blk[2] if len(blk)>2 else 1
            for i,q in enumerate(blk[1],start): body.append(qcard(i,q))
        elif k=='promo': body.append(promo(blk[1],camp))
        elif k=='docs': body.append(dsec(blk[1]))
        elif k=='pb': body.append('<div class="pb"></div>')
        elif k=='p': body.append(f'<p>{E(nb(blk[1]))}</p>')
        elif k=='svc':
            body.append(''.join(f'<a class="svc{" acc" if acc else ""}" href="{u(path,c,camp)}"><div><b>{E(a)}</b><span>{E(nb(b))}</span></div><div class="sp">{E(nb(p))}</div></a>' for a,b,p,path,c,acc in blk[1]))
        elif k=='big':
            t,text,btn,path,c=blk[1]
            body.append(f'<div class="big"><h3>{E(t)}</h3><p>{E(nb(text))}</p><a class="pr-b" href="{u(path,c,camp)}">{E(nb(btn))} →</a></div>')
    head=f'<div class="hd"><div class="brand"><img src="data:image/png;base64,{LOGO}" alt="Маяк"><div><div class="bn">Маяк</div><div class="bs">Юридическая проверка недвижимости</div></div></div><div class="hr"><b>{E(S["label"])}</b><span>Бесплатный материал</span><span>www.mayak-legal.ru</span></div></div>'
    foot=f'''<div class="cap">Свяжитесь с нами</div>
<div class="ct"><a href="{u('/','contacts',camp)}"><small>Сайт</small><b>www.mayak-legal.ru</b></a><a href="mailto:info@mayak-legal.ru"><small>Почта</small><b>info@mayak-legal.ru</b></a><a href="https://t.me/mayak_legal"><small>Telegram-канал</small><b>@mayak_legal</b></a></div>
<p class="legal">Юридический сервис «Маяк». Материал подготовлен в справочных целях и не заменяет индивидуальную юридическую консультацию. Индивидуальный предприниматель Семенова Вероника Владимировна, ОГРНИП 326774600606201, ИНН 781148247234. Стоимость и сроки услуг актуальны на дату редакции и уточняются на сайте. Заявки принимаем круглосуточно, отвечаем с 9 до 20 по московскому времени.</p>'''
    style=STYLE.replace('бесплатный чек-лист для покупателя',S['footer'])
    doc=f'<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>{E(S["title"])} — Маяк</title><style>{style}</style></head><body>{head}<h1>{E(S["title"])}</h1><p class="lead">{E(S["lead"])}</p>{"".join(body)}{foot}</body></html>'
    hp=out.replace('.pdf','.html'); open(hp,'w',encoding='utf-8').write(doc)
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b=p.chromium.launch(); pg=b.new_page(); pg.goto('file://'+hp); pg.wait_for_timeout(600)
        pg.pdf(path=out,format='A4',print_background=True,prefer_css_page_size=True); b.close()
