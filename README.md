# Emre Ceyhan — Portfolio

Source code for [emreceyhan.xyz](https://emreceyhan.xyz), my personal portfolio site.

React + TypeScript + Vite, deployed on Vercel. Showcases my featured projects
(Watchlight, LogiTrack, DocuMind, DeployBox, Mavi Rota), work experience, and
technical skills — all pulled from a single typed data source
(`src/services/dataService.ts`) kept in sync with my résumé.

## Stack

- React 19 + TypeScript + Vite
- Custom WebGL/GLSL shader hero background (no three.js dependency on the
  production path — see `portfolio/README.md` for the implementation notes)
- Deployed on Vercel with a custom domain

## Project docs

Detailed build notes, audits, and retrospectives live in
[`portfolio/README.md`](portfolio/README.md), `portfolio/AUDIT.md`, and
`portfolio/RETROSPECTIVE.md`.
