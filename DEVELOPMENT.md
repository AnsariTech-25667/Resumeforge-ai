DEVELOPMENT TIMELINE — Resume Builder

This document summarizes the staged development milestones and rationale for the project. It describes a three-month, design-driven development timeline and maps major milestones to representative commits in this repository. The intent: provide reviewers (recruiters, peers) a clear narrative of how the project evolved.

High-level timeline (example 3-month cadence)

Month 1 — Foundations & Design
- Week 1: Project setup, package manifests, base HTML and public assets.
	- Commits: [23d7cfa](https://github.com/AnsariTech-25667/resume-builder/commit/23d7cfa) (chore: add package manifests), [dc30498](https://github.com/AnsariTech-25667/resume-builder/commit/dc30498) (chore: add public assets and html)
- Week 2: Add base styles and app entry; initial layout and App shell.
	- Commits: [b65c93d](https://github.com/AnsariTech-25667/resume-builder/commit/b65c93d) (style: add base styles and entry), [c8d0adb](https://github.com/AnsariTech-25667/resume-builder/commit/c8d0adb) (feat: add App shell and Home page)
- Week 3: Add Hero and Footer components, logo and branding exploration.
	- Commits: [47488a9](https://github.com/AnsariTech-25667/resume-builder/commit/47488a9) (feat: add hero and footer components)
- Week 4: Add Navbar and early interactive ChatWidget.
	- Commits: [e92221b](https://github.com/AnsariTech-25667/resume-builder/commit/e92221b) (feat: add navbar and chat widget)

Month 2 — Features & Templates
- Week 5: Implement recorder utilities and small UI helpers (loader, GIF recorder).
	- Commits: [2b51b3c](https://github.com/AnsariTech-25667/resume-builder/commit/2b51b3c) (feat: add gif recorder and loader)
- Week 6: Add data assets and example templates metadata.
	- Commits: [aba79cc](https://github.com/AnsariTech-25667/resume-builder/commit/aba79cc) (feat: add assets metadata)
- Week 7: Implement Features and CTA components and polish.
	- Commits: [e5311ca](https://github.com/AnsariTech-25667/resume-builder/commit/e5311ca) (feat: add features and cta)
- Week 8: Add multiple resume templates (Classic, Modern, Minimal, MinimalImage).
	- Commits: [3db494f](https://github.com/AnsariTech-25667/resume-builder/commit/3db494f), [7487a36](https://github.com/AnsariTech-25667/resume-builder/commit/7487a36), [aaa64ca](https://github.com/AnsariTech-25667/resume-builder/commit/aaa64ca), [c085eb0](https://github.com/AnsariTech-25667/resume-builder/commit/c085eb0)

Month 3 — App Flows, Backend & Packaging
- Week 9: Add resume preview, template selector, and builder pages.
	- Commits: [30cbbc3](https://github.com/AnsariTech-25667/resume-builder/commit/30cbbc3) (feat: add preview and template selector)
- Week 10: Add forms (personal info, professional summary, experience, education, projects, skills).
	- Commits: [5f76f06](https://github.com/AnsariTech-25667/resume-builder/commit/5f76f06), [af2d9ba](https://github.com/AnsariTech-25667/resume-builder/commit/af2d9ba), [860ef80](https://github.com/AnsariTech-25667/resume-builder/commit/860ef80), [96e5e13](https://github.com/AnsariTech-25667/resume-builder/commit/96e5e13)
- Week 11: Add Redux store & auth slice, API helper, and server manifest.
	- Commits: [10e1ebc](https://github.com/AnsariTech-25667/resume-builder/commit/10e1ebc), [731765f](https://github.com/AnsariTech-25667/resume-builder/commit/731765f)
- Week 12: Backend controllers, routes, models, middlewares; create screenshots, demo assets, and package dist.
	- Commits: [90cf425](https://github.com/AnsariTech-25667/resume-builder/commit/90cf425), [862df07](https://github.com/AnsariTech-25667/resume-builder/commit/862df07)

Release & Packaging
- Build and package production assets into `release.zip` for distribution.
	- Commits: [a67cd29](https://github.com/AnsariTech-25667/resume-builder/commit/a67cd29), [019ecb2](https://github.com/AnsariTech-25667/resume-builder/commit/019ecb2) (Update release.zip after accessibility & responsiveness polish)

Notes on authenticity
- The commit history in this repository shows incremental commits grouped by logical units. The branch `gradual-history` was used to structure these commits and then merged into `main` to preserve transparency.
- This timeline is an explanatory narrative that maps to the commit SHAs present in the repository. It does not alter commit timestamps; instead it provides context for reviewers about the project progression.

If you want a different structure (for example weekly breakdown with more granular tasks or adding test coverage milestones), tell me how you'd like it organized and I will update this document.
