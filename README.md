# presentations

Private repo for building and versioning slide decks.

## Layout

```text
decks/            # .pptx sources (and .potx templates), committed
tools/
  preview.sh      # .pptx -> PDF + per-slide PNGs + preview/index.html
  serve-preview.sh# detached local web server for the gallery
preview/          # generated renders (git-ignored)
```

## Build a deck

Decks are generated with [`pptxgenjs`](https://gitbrent.github.io/PptxGenJS/); the source script for each deck lives next to its output:

```text
decks/<name>/deck.js      # generator
decks/<name>/deck.pptx    # output (committed)
decks/<name>/deck.pdf     # export (committed), GitHub renders PDFs in the browser
lib/apply_theme.py        # patches the theme palette/fonts into the .pptx
```

```bash
npm install               # once, installs pptxgenjs
cd decks/<name>
node deck.js
```

`deck.js` writes the .pptx and then calls `lib/apply_theme.py` (python3, stdlib
only) to stamp the theme name, palette and fonts into `theme1.xml`; pptxgenjs
itself only writes the theme fonts.

## Preview a deck

```bash
tools/preview.sh decks/<name>/deck.pptx     # render only
tools/preview.sh decks/<name>/deck.pptx --serve
```

`--serve` starts a detached server on `127.0.0.1:8000`, so it survives an SSH
disconnect. Manage it with:

```bash
tools/serve-preview.sh --status
tools/serve-preview.sh --stop
```

To view it from another machine, tunnel the port from your laptop (not from the
server):

```bash
ssh -N -L 8000:127.0.0.1:8000 <user>@<host>
# then open http://localhost:8000/
```

Or pull the rendered PDF:

```bash
scp <user>@<host>:~/Projects/Pfe_prez/preview/<name>.pdf .
```

LibreOffice renders the previews; fonts can differ slightly from PowerPoint, so
open the `.pptx` itself for the final check. For a faithful preview install
Montserrat and Carlito (`fc-match Montserrat` should not fall back to a
substitute).

## Local toolchain (this machine)

`node`, `npm`, `gh` live under `~/.local` (shims in `~/.local/bin`); the Python
deps (`python-pptx`, `lxml`, `defusedxml`) are installed to the user site. The
theme patch no longer depends on the `pptx` skill: `lib/apply_theme.py` is
vendored in this repo and needs only the python3 standard library.
