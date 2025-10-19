# Resume Builder

Resume Builder is a polished, lightweight web app for creating modern, recruiter-friendly resumes quickly. It combines a clean visual editor with AI-assisted enhancements so you can produce tailored resumes in minutes.

Built & maintained by Maaz Ansari

Website: https://maazansari.example.com  •  Email: maaz.ansari@example.com

## Demo

Live demo: (deploy this repository to a static host or a Node host)

Screenshots
1. Hero / Dashboard
	![screenshot-1](./docs/screenshots/dashboard.png)
2. Template preview
	![screenshot-2](./docs/screenshots/template-preview.png)

_I can generate these screenshots and add them to the repo if you like — say the word and I'll produce them._

## Key features
- Multiple editable resume templates (Classic, Modern, Minimal, Minimal+Image)
- AI-assisted resume improvements (bullet refinement, summary generation)
- Export to PDF and printable layouts
- Simple, distraction-free UI focused on recruiter-readability

## Quick start (developer)
1. Clone the repo and install dependencies

```powershell
cd 'C:\path\to\resume-builder\client'
npm install
npm run dev

cd 'C:\path\to\resume-builder\server'
npm install
npm run server
```

2. Build for production (client)

```powershell
cd client
npm run build
```

3. Production deploy
- Build the client and serve the `client/dist` folder from any static host.
- Run the server (if you need the API) and set the `API_URL` in the client configs.

## How recruiters should evaluate this project
- Browse the demo and preview multiple templates.
- Check the `client/src/components/templates` folder to see the output HTML structure and Tailwind classes used for print-friendly layouts.
- Run the build to validate production readiness.

## About the author
Maaz Ansari is a frontend engineer focused on building accessible, design-forward web interfaces. Contact: maaz.ansari@example.com — https://maazansari.example.com

## License & notes
This repository is provided as-is. © 2025 Maaz Ansari

---

If you'd like, I can now:
- Commit this README and push the repo to a new remote you provide.
- Generate and add screenshots (I will run the app headlessly and capture images of the templates).
- Minify/optimize the large client chunk by introducing code-splitting recommendations.
