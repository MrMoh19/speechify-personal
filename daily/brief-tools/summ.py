import json, sys, re
d = json.load(open(sys.argv[1]))
NOISE = re.compile(r'(noreply|no-reply|newsletter|news@|email@|info@|marketing|itannounce|theatlantic|sagepub|lupine|scsconferences|springerpub|postdoc@|announce)', re.I)
ME = ('abbaaji189@gmail.com',)
print(len(d.get('threads', [])), d.get('resultCountEstimate'))
for t in d.get('threads', []):
    ms = t.get('messages', [])
    subj = (ms[0].get('subject') or '')[:90] if ms else ''
    noise = all(NOISE.search(m.get('sender', '')) for m in ms)
    print('## %s n=%s | %s%s' % (t['id'], t.get('messageCount', len(ms)), subj, ' (noise)' if noise else ''))
    for m in ms:
        tag = '[ME] ' if m.get('sender') in ME else ''
        sn = re.sub(r'\s+', ' ', m.get('snippet', ''))[:200]
        print('   %s %s%s :: %s%s' % (m.get('date', '')[:16], tag, m.get('sender'), sn, ' (noise)' if noise else ''))
