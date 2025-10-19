Resume Builder — Recruiter One-Pager

Author: Maaz Ansari <maaz.ansari@example.com>
Repository: https://github.com/AnsariTech-25667/resume-builder

Quick pitch
-----------
Resume Builder is a focused web tool that helps candidates produce recruiter-readable resumes in minutes. It combines a minimal, print-friendly template set with AI-assisted refinement (bullets, summary, keywords) and export to PDF.

What to evaluate (5-minute checklist)
------------------------------------
1) Visual polish & UX (30–60s)
   - Open the demo and inspect the templates. Look for clean typography, spacing, and consistent color usage across templates.
2) Template fidelity (60–90s)
   - Export a resume to PDF and check margins, alignment, and that sections don’t overflow across pages.
3) AI assistance (90–120s)
   - Use the summary/bullets AI features to improve a short resume section. Confirm the output is concise, role-focused, and non-generic.
4) Accessibility (optional)
   - Check color contrast and keyboard navigation. The project includes automated a11y checks; run them locally if needed.

Interview talking points
------------------------
- Design tradeoffs: explain how templates balance ATS parsing with visual emphasis. Be ready to discuss choices around typography, spacing, and print rule selectors.
- Data model decisions: describe the resume data shape (sections, items, bullets) and how it maps to templates when rendering.
- AI safety: discuss the deterministic post-processing you use to avoid hallucinated facts (basic sanitization and rephrasing prompts plus user review before export).
- Performance: how the app keeps client bundles lean (code-splitting, lightweight dependencies) and server responsibilities minimal.

Security & privacy note
-----------------------
User-provided resume text is treated as private by default. The demo server stores data only in development mode; in production you'd configure encrypted storage and user consent flows.

Why this matters
-----------------
- Recruiters evaluate clarity and scannability in seconds — this project minimizes noise and surfaces role-aligned accomplishments.
- The templates are designed for both ATS compatibility and visual clarity, combining semantic markup and print-ready CSS.

How to run locally (developer)
------------------------------
1) Install dependencies and start dev server:

```powershell
cd client
npm install
npm run dev
```

2) Build for production:

```powershell
cd client
npm run build
```

3) The production assets are in `client/dist`. Serve or inspect the `index.html` file.

Contact
-------
Maaz Ansari — maaz.ansari@example.com — https://maazansari.example.com

Notes
-----
- I can provide a short recorded walkthrough or a live preview if you want to see how a HR reviewer would walk through the app. Reach out and I'll arrange it.
