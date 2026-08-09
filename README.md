# 4krom Portfolio

```sh
git clone https://github.com/4kromm/portofolio.git
```

> 🔗 Live: [4kromm.github.io/portofolio](https://4kromm.github.io/portofolio/)

## 🚀 Project Structure

Inside of this Astro project, you'll see the following folders and files:

```text
/
├── public/
│   ├── assets/
│   │   ├── audio/
│   │   ├── dino/
│   │   ├── images/
│   │   └── svg/
│   ├── css/
│   └── js/
│       ├── features/
│       └── main.js
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   │   └── index.astro
│   └── styles/
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where all the section components live — `Hero.astro`, `Projects.astro`, `TechStack.astro`, `TechArsenalWrapper.astro`, `Overview.astro`, `LifeLogs.astro`, `Navbar.astro`, `Footer.astro`, `Modal.astro`, etc.

Global styles live in `src/styles/` (base, animations, components, patterns, variables). Static assets and vanilla JS features (project filter, inspect-code modal, dino game, GitHub snake, audio player) live in `public/`.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command | Action |
| :--- | :--- |
| `npm install` | Installs dependencies |
| `npm run dev` | Starts local dev server at `localhost:4321` |
| `npm run build` | Build your production site to `./dist/` |
| `npm run preview` | Preview your build locally, before deploying |

## 👀 Want to learn more?

Feel free to check [Astro's documentation](https://docs.astro.build) or the source code in `src/components/`.
