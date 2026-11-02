"""Genera los iconos de especialidades a partir de Healthicons (CC0) y actualiza data/specialties.yaml.

Uso: python3 -I build.py <repo> <cache_dir> [--apply]
Sin --apply solo genera los SVG en <cache_dir>/out y una hoja de previsualización.
"""
import os, re, sys, unicodedata, urllib.request, html

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mapping import MAIN, SUB  # noqa: E402

REPO, CACHE = sys.argv[1], sys.argv[2]
APPLY = "--apply" in sys.argv
BASE_URL = "https://raw.githubusercontent.com/resolvetosavelives/healthicons/main/public/icons/svg/outline/"
COLOR, BG = "#0077A3", "#E8F4F9"
OUT = os.path.join(CACHE, "out")
os.makedirs(os.path.join(CACHE, "src"), exist_ok=True)
os.makedirs(OUT, exist_ok=True)


def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def inner(path):
    f = os.path.join(CACHE, "src", path.replace("/", "__") + ".svg")
    if not os.path.exists(f):
        urllib.request.urlretrieve(BASE_URL + path + ".svg", f)
    s = open(f, encoding="utf-8").read()
    assert 'viewBox="0 0 48 48"' in s, path
    body = re.sub(r"^.*?<svg[^>]*>", "", s, flags=re.S)
    body = re.sub(r"</svg>\s*$", "", body.strip())
    return body.replace("currentColor", COLOR)


def build(spec):
    parts = spec.split("+")
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="70" height="70">',
           f'<circle cx="24" cy="24" r="24" fill="{BG}"/>']
    if len(parts) == 1:
        out.append(f'<g transform="translate(9.6 9.6) scale(0.6)">{inner(parts[0])}</g>')
    else:
        out.append(f'<g transform="translate(6 6) scale(0.54)">{inner(parts[0])}</g>')
        out.append(f'<circle cx="34.5" cy="34.5" r="12.5" fill="#fff" stroke="{BG}" stroke-width="1.2"/>')
        out.append(f'<g transform="translate(24.18 24.18) scale(0.43)">{inner(parts[1])}</g>')
    out.append("</svg>")
    return "\n".join(out) + "\n"


# Cada icono final debe ser único
specs = list(MAIN.values()) + list(SUB.values())
dupes = {s for s in specs if specs.count(s) > 1}
assert not dupes, f"Iconos repetidos: {dupes}"

# Recorrer specialties.yaml en orden para saber a qué especialidad pertenece cada subespecialidad
yaml_path = os.path.join(REPO, "data/specialties.yaml")
lines = open(yaml_path, encoding="utf-8").read().split("\n")
parent, current, items, missing = None, None, [], []
for i, l in enumerate(lines):
    m = re.match(r"^- name: (.*)$", l)
    if m:
        parent = m.group(1).strip().strip("'\"")
        current = ("main", parent)
        continue
    m = re.match(r"^  - name: (.*)$", l)
    if m:
        current = ("sub", (parent, m.group(1).strip().strip("'\"")))
        continue
    m = re.match(r"^(\s*)icon: (.*)$", l)
    if m and current:
        kind, key = current
        spec = MAIN.get(key) if kind == "main" else SUB.get(key)
        if not spec:
            missing.append(key)
            continue
        name = key if kind == "main" else f"{key[0]}-{key[1]}"
        fname = slug(name) + ".svg"
        open(os.path.join(OUT, fname), "w").write(build(spec))
        items.append((kind, key, fname, i, m.group(1)))
        current = None

assert not missing, f"Sin icono asignado: {missing}"
print(len(items), "iconos generados")

# Hoja de previsualización
cards = "".join(
    f'<div class=c><img src="out/{f}"><p>{html.escape(k if kind=="main" else k[1])}</p>'
    f'<small>{"" if kind=="main" else html.escape(k[0])}</small></div>'
    for kind, k, f, _, _ in items)
open(os.path.join(CACHE, "preview.html"), "w").write(
    "<html><body style='font-family:-apple-system;background:#f8fafc;margin:16px'><style>"
    ".g{display:grid;grid-template-columns:repeat(10,1fr);gap:8px}.c{background:#fff;border:1px solid #e2e8f0;border-radius:8px;"
    "padding:6px;text-align:center}img{width:64px;height:64px}p{font-size:10.5px;margin:3px 0 0;font-weight:600}"
    "small{font-size:9px;color:#64748b}</style><div class=g>" + cards + "</div></body></html>")

if APPLY:
    dest = os.path.join(REPO, "static/images/icons/especialidades")
    os.makedirs(dest, exist_ok=True)
    for kind, key, fname, i, indent in items:
        os.replace(os.path.join(OUT, fname), os.path.join(dest, fname)) if False else None
        open(os.path.join(dest, fname), "w").write(open(os.path.join(OUT, fname)).read())
        lines[i] = f"{indent}icon: /images/icons/especialidades/{fname}"
    open(yaml_path, "w", encoding="utf-8").write("\n".join(lines))
    print("aplicado en", dest)
