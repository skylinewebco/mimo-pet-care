import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this repo at https://skylinewebco.github.io/mimo-pet-care/
const REPO_BASE = '/mimo-pet-care/'

// Dev-only QA helper: with ?qa in the URL, drive requestAnimationFrame from
// setTimeout so animations still run inside hidden/background preview tabs.
const qaRafShim = {
  name: 'qa-raf-shim',
  apply: 'serve',
  transformIndexHtml: () => [
    {
      tag: 'script',
      injectTo: 'head-prepend',
      children:
        "if(location.search.includes('qa')){let id=0;const cbs=new Map();window.requestAnimationFrame=(cb)=>{const i=++id;cbs.set(i,setTimeout(()=>{cbs.delete(i);cb(performance.now())},16));return i};window.cancelAnimationFrame=(i)=>{clearTimeout(cbs.get(i));cbs.delete(i)}}",
    },
  ],
}

export default defineConfig(({ command }) => ({
  // Local dev stays at "/", production build uses the repo sub-path.
  base: command === 'build' ? process.env.BASE_PATH || REPO_BASE : '/',
  plugins: [react(), qaRafShim],
}))
