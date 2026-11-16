"""Baut die Live-Fassung b77.de/trailer aus intro/aermel-hoch.html.

Aufruf: python3 intro/build-trailer.py <zielordner>   (Ziel = Repo-Wurzel, z. B. ein monolith-Worktree)
Schreibt <ziel>/trailer/index.html + nur die benötigten Assets mit absoluten Pfaden
(/trailer/assets/...), weil trailingSlash:false relative Pfade unter /trailer auf / auflöst.
"""
import os, re, shutil, sys
SRC = os.path.dirname(os.path.abspath(__file__))
dst = os.path.join(sys.argv[1], 'trailer')
s = open(os.path.join(SRC, 'aermel-hoch.html')).read()
n = s.count('assets/')
s = (s.replace('url(assets/', 'url(/trailer/assets/')
      .replace('src="assets/', 'src="/trailer/assets/')
      .replace("var A = 'assets/';", "var A = '/trailer/assets/';")
      .replace("var A='assets/';", "var A='/trailer/assets/';"))
assert s.count('/trailer/assets/') == n, 'unbekannte assets/-Referenz in der Quelle'
def rep(a, b):
    global s
    assert s.count(a) == 1, a[:60]
    s = s.replace(a, b)
rep('<title>B_77 · Manifest</title>', '<title>B_77 · Ärmel hoch</title>')
s = re.sub(r'<meta name="description" content="[^"]*">',
    '<meta name="description" content="Ärmel hoch: Aus Trümmern wurden Werkhallen, aus Werkhallen Weltmarktführer. '
    'Jetzt holen wir uns die Märkte zurück. B_77, Vertriebsberatung für den Mittelstand.">', s, count=1)
rep('<div class="topbar"><div class="b"><i></i>B_77</div>\n    <div class="tbr"><div class="st">Kino-Bildfolge</div>',
    '<div class="topbar"><a class="b" href="/" style="color:inherit;text-decoration:none;pointer-events:auto"><i></i>B_77</a>\n'
    '    <div class="tbr"><a class="st" href="/impressum" style="text-decoration:none">Impressum</a>')
rep('.topbar .st{font-family:var(--mono);', '.topbar .st:hover,.topbar .st:focus-visible{color:var(--paper)}\n.topbar .st{font-family:var(--mono);')
assert '—' not in s
# Live-Fassung = nur der Film: Lesefassung mit internen Notizen entfernen (wie bei der Vorschau)
s, n_css = re.subn(r"/\* ===== Lesefassung ===== \*/.*?(?=</style>)", "", s, flags=re.S)
s, n_doc = re.subn(r'<section class="doc">.*?</section>\s*', "", s, flags=re.S)
assert n_css == 1 and n_doc == 1, (n_css, n_doc)
rep("skip.addEventListener('click', function(){ pause(); document.querySelector('.doc').scrollIntoView({behavior:'smooth'}); });",
    "skip.addEventListener('click', function(){ pause(); if(!ended) toEnd(); });")
rep("else if(e.code==='Escape'||(e.code==='Enter'&&!onBtn)){ pause(); document.querySelector('.doc').scrollIntoView({behavior:'smooth'}); }",
    "else if(e.code==='Escape'||(e.code==='Enter'&&!onBtn)){ pause(); if(!ended) toEnd(); }")
assert "querySelector('.doc')" not in s and 'class="doc"' not in s and "Lesefassung" not in s
# benötigte Dateien
files = set(re.findall(r'/trailer/assets/([\w./-]+\.(?:png|jpg|woff2))', s))
files |= {m for m in re.findall(r"img:'([\w.-]+\.jpg)'", s)}
files |= {'vo-helmut/aermel-hoch-vo.mp3'}
if os.path.exists(dst): shutil.rmtree(dst)
for f in sorted(files):
    os.makedirs(os.path.dirname(os.path.join(dst, 'assets', f)), exist_ok=True)
    shutil.copy2(os.path.join(SRC, 'assets', f), os.path.join(dst, 'assets', f))
open(os.path.join(dst, 'index.html'), 'w').write(s)
print(len(files), 'Assets ->', dst)
