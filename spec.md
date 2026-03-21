# HireKra

## Current State
The website is fully built with all sections (Hero, About, Presence, Expertise, Hiring Process, Leadership, Why Choose, Client CTA, Contact). The contact form currently only shows a toast notification — submissions are NOT saved anywhere. There is no admin dashboard.

## Requested Changes (Diff)

### Add
- Backend: store "Partner With Us" form submissions (name, email, company, hiringNeeds, timestamp)
- Backend: admin login with password (HireKra@2024) to retrieve all submissions
- Frontend: wire the contact form to call backend on submit
- Frontend: admin dashboard page (accessible via #admin route) — password-protected view listing all partner form submissions in a table with name, email, company, hiring needs, and date

### Modify
- Contact form `handleSubmit` to call the backend actor instead of just showing a toast

### Remove
- Nothing removed

## Implementation Plan
1. Motoko backend: `submitPartnerForm(name, email, company, hiringNeeds)` — stores submissions with timestamp; `getSubmissions(password)` — returns all submissions if password matches
2. Frontend: import backend bindings, call `submitPartnerForm` on form submit
3. Frontend: AdminDashboard component rendered when `window.location.hash === '#admin'` — password entry screen, then table of all submissions
