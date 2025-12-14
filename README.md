# Kenya Digital Bridge — EDUCHAIN Landing

A small landing site and Flask backend for the "Kenya Digital Bridge" initiative (working title "EDUCHAIN"). This repository contains a single-page landing site (`index.html`) with CSS and JavaScript, and a minimal Flask backend (`app.py`) used to accept partnership/inquiry submissions and serve as a placeholder for future donation integrations (e.g., M-Pesa STK Push).

This README documents how to run the project locally, the project structure, development notes, and next steps if you want to continue building the product.

---

## Features

- Responsive landing page (`index.html`) with sections: problem, root cause, impact, testimonials, and call-to-action.
- Animated counters and reveal animations (client-side) for improved engagement.
- Partnership / Inquiry form that POSTs to a Flask backend route (`/submit_inquiry`) and saves submissions to a local SQLite database.
- Donation modal UI (placeholder) with actions for M-Pesa or card payments; backend stub exists at `/initiate_donation`.
- Minimal, easy-to-extend codebase suitable for prototyping and local testing.

---

## Tech Stack

- Frontend: HTML, CSS, vanilla JavaScript (no build step required)
- Backend: Python, Flask, Flask-SQLAlchemy (SQLite for development)
- Dev tools: A simple static server or Flask's built-in development server

---

## File Overview

- `index.html` — Landing page markup and UI.
- `style.css` — Site styles and responsive layout.
- `script.js` — Frontend behavior (form submission, counters, modal handling).
- `app.py` — Minimal Flask backend with routes:
  - `/` — basic index status text
  - `/submit_inquiry` — accepts POST JSON to save partnership inquiries
  - `/initiate_donation` — placeholder for future M-Pesa integration
- `requirements.txt` — Python dependencies for the backend.

---

 

## Backend Notes & Security

- The backend currently uses SQLite for convenience. For production use, switch to a managed DB (Postgres/MySQL) and update `app.config['SQLALCHEMY_DATABASE_URI']`.
- Set a secure `SECRET_KEY` in the Flask config or via environment variables. Currently the code leaves that commented for development.
- The `/initiate_donation` route is only a placeholder. Integrating M-Pesa requires using a secure server-side integration (e.g., Safaricom Daraja API) and careful handling of credentials and callbacks.
- Do not commit production secrets (API keys, DB passwords) to the repository.

---

## Development Tips

- Linting & formatting: use `black` and `flake8` (optional) for Python; use `prettier` for HTML/CSS/JS if desired.
- To reset the local DB during development:

```powershell
# Stop the Flask server, then remove the file
Remove-Item .\site.db
# Restart app.py to recreate the DB and tables
python app.py
```

- If you want the frontend to use a production-ready static server, consider deploying to GitHub Pages, Netlify, or Vercel, and host the backend separately (Heroku, Railway, Azure, etc.).

---

## Recommended Next Steps / Improvements

- Implement real M-Pesa STK Push integration in `initiate_donation` (server-side) and wire the frontend to call it securely.
- Add server-side validation and rate-limiting to `/submit_inquiry`.
- Improve accessibility (aria attributes, focus states on modal, keyboard trap while modal open).
- Add unit tests for backend routes (`pytest`) and an integration test for form submission.
- Add a simple build pipeline for CSS (PostCSS) and optionally convert to a small React/Vue app if more interactivity is required.

---

## Contributing

Feel free to open issues or submit pull requests. When contributing:

- Describe the problem and include steps to reproduce.
- Include screenshots or a short recording for UI changes.
- Write tests for new backend behavior where appropriate.

---

## License

This repository does not include a license file. If you plan to publish or share the code, add a `LICENSE` file (e.g., MIT, Apache-2.0) to clarify terms.

---

If you'd like, I can also:
- Start the Flask server here and run a quick smoke test of the `/submit_inquiry` flow.
- Improve or reword any README section to match your preferred tone.

