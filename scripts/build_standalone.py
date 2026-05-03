#!/usr/bin/env python3
"""Build standalone HTML — combine all jsx into single file for offline use."""
import os, re

# Paths
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src')
OUT = os.path.join(ROOT, 'Standalone.html')

# JSX files in load order (mirror index.html script order)
JSX_FILES = [
    ('components/layout/main.jsx', 'Layout components'),
    ('pages/main/TebakKata.jsx',   'Wordle game'),
    ('pages/auth/Onboarding.jsx',   'Onboarding flow'),
    ('components/nala/nala-mascot-and-page.jsx', 'Nala mascot + page'),
    ('pages/Beranda.jsx',           'Beranda'),
    ('pages/komunitas/Index.jsx',   'Komunitas'),
    ('pages/komunitas/ThreadDetail.jsx', 'Thread Detail'),
    ('pages/karya/Index.jsx',       'Karya'),
    ('pages/karya/ReadingView.jsx', 'Karya Reading View'),
    ('pages/kelas/Index.jsx',       'Kelas'),
    ('pages/kelas/LessonPlayer.jsx','Kelas Lesson Player'),
    ('pages/aksi/Index.jsx',        'Aksi'),
    ('pages/aksi/PetisiDetail.jsx', 'Petisi Detail'),
    ('pages/tagih/Index.jsx',       'Tagih Janji'),
    ('pages/tagih/JanjiDetail.jsx', 'Janji Detail'),
    ('pages/main/Index.jsx',        'Main (games)'),
    ('pages/profil/Index.jsx',      'Profil'),
    ('pages/profil/PasporPublic.jsx', 'Paspor Public'),
    ('App.jsx',                     'App router'),
]

# Read base index.html
with open(os.path.join(ROOT, 'index.html')) as f:
    base = f.read()

# Build inline scripts
inline = []
for relpath, label in JSX_FILES:
    full = os.path.join(SRC, relpath)
    if not os.path.exists(full):
        print(f'  ⚠ skip missing: {relpath}')
        continue
    with open(full) as f:
        content = f.read()
    inline.append(f'<script type="text/babel" data-source="src/{relpath}">\n// === {label} ({relpath}) ===\n{content}\n</script>')
    print(f'  ✓ {relpath}')

# Replace src tags with inline blocks
lines = base.split('\n')
new_lines = []
inserted = False
for line in lines:
    if 'type="text/babel"' in line and 'src=' in line:
        if not inserted:
            new_lines.append("\n".join(inline))
            inserted = True
        continue
    new_lines.append(line)

result = "\n".join(new_lines)

with open(OUT, 'w') as f:
    f.write(result)

# Verify
import re
print(f'\nStandalone built: {len(result)/1024:.1f} KB')
print(f'  Path: {OUT}')
print(f'  Inline scripts: {result.count(chr(60) + "script type=" + chr(34) + "text/babel" + chr(34))}')
print(f'  External CDN: {result.count(chr(60) + "script src=" + chr(34) + "https")}')
print(f'  Orphan src tags: {len(re.findall(chr(34) + "[^" + chr(34) + "]*.jsx" + chr(34), result))}')
