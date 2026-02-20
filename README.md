# MalangaCraft

Landing page for the MalangaCraft Minecraft server (FTB Stoneblock 4).

## Dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview   # preview dist/
```

## Deploy (GitHub Actions)

The site deploys to **GitHub Pages** on every push to `main` or `master`.

1. **Enable GitHub Pages** in the repo:
   - **Settings** → **Pages** → **Build and deployment**
   - **Source**: GitHub Actions

2. Push to `main` (or `master`). The workflow builds the app and deploys the `dist/` folder.

3. The site will be at:  
   `https://<owner>.github.io/<repo-name>/`

If the repo is `malangacraft`, the URL is `https://<owner>.github.io/malangacraft/`.
