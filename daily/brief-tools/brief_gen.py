import json, sys, base64, html, glob
d = json.load(open(sys.argv[1]))
font = glob.glob('/root/.claude/skills/synced/*/morning/assets/fonts/fraunces-latin-600-normal.woff2')
ff = ''
if font:
    ff = '@font-face{font-family:Fraunces;src:url(data:font/woff2;base64,%s) format("woff2");font-weight:600}' % base64.b64encode(open(font[0], 'rb').read()).decode()
e = lambda s: html.escape(s, quote=True)
CSS = ff + """
:root{--bg:#FCFCFB;--wash:#F9F9F7;--ink:#2E2C27;--soft:#6B6A63;--grey:#B4B3A8;--hair:#E4E3DC}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 -apple-system,"Segoe UI",sans-serif}
.band{padding:48px 24px}.top{background:var(--wash);border-bottom:1px solid #E1E1DF}.in{max-width:860px;margin:0 auto}
.date{color:var(--soft);font-size:13px;margin:0 0 8px}h1{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:40px;line-height:1.15;margin:0 0 24px}
svg{display:block;width:100%;height:auto}
.acts{display:grid;grid-template-columns:repeat(3,1fr);margin-top:8px}.act{padding:0 18px;border-left:1px solid var(--hair)}.act:first-child{border-left:0;padding-left:0}
.act b{display:block;font-size:13px;margin-bottom:4px}.act p{margin:0;color:var(--soft);font-size:14px}
h2{font-size:15px;font-weight:600;margin:0 0 14px}ol{list-style:none;margin:0 0 40px;padding:0}li{display:flex;gap:14px;margin-bottom:16px}
.n{color:var(--grey);font-size:14px;min-width:14px}.t{font-weight:600}.t a{color:var(--ink);text-decoration:none}li p{margin:2px 0 0;color:var(--soft)}
a.src{color:var(--soft);text-decoration:underline;text-decoration-color:var(--grey)}
@media (max-width:640px){h1{font-size:30px}.acts{grid-template-columns:1fr}.act{border-left:0;border-top:1px solid var(--hair);padding:12px 0}.act:first-child{border-top:0}}
"""
def items(lst):
    out = []
    for i, it in enumerate(lst, 1):
        u = it.get('url') or ''
        title = '<a href="%s">%s</a>' % (e(u), e(it['title'])) if u else e(it['title'])
        src = '<a class="src" href="%s">%s</a>' % (e(u), e(it['src'])) if u else e(it['src'])
        out.append('<li><span class="n">%d</span><div><div class="t">%s</div><p>%s %s</p></div></li>' % (i, title, src, e(it['rest'])))
    return '<ol>' + ''.join(out) + '</ol>'
dots = ''.join('<circle cx="%d" cy="118" r="7" fill="#B4B3A8"/>' % x for x in d.get('grey_dots', []))
acts = ''.join('<div class="act"><b>%s</b><p>%s</p></div>' % (e(t), e(s)) for t, s in d['acts'])
body = ''
if d['needs'] or d['resolved']:
    if d['needs']: body += '<h2>Needs attention</h2>' + items(d['needs'])
    if d['resolved']: body += '<h2>Resolved</h2>' + items(d['resolved'])
else:
    body = '<p>Nothing needs you this morning.</p>'
page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Morning Brief</title>
<style>{CSS}</style></head><body>
<section class="band top"><div class="in">
<p class="date">{e(d['date'])}</p>
<h1>{e(d['headline'])}</h1>
<svg viewBox="0 0 840 170" aria-hidden="true">
<path d="M0 118 C140 116 280 120 420 118 S700 116 840 118" fill="none" stroke="#2E2C27" stroke-width="2.2" stroke-linecap="round"/>{dots}
{d.get('motif','')}
</svg>
<div class="acts">{acts}</div></div></section>
<section class="band"><div class="in">{body}</div></section></body></html>'''
open(sys.argv[2], 'w').write(page)
