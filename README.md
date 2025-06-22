# 🔗 URL Shortener

A simple URL shortener built using Node.js and JSON file storage.

---

## 📌 Features

- Shorten any long URL
- Custom shortcode support
- Redirects using shortened links
- Stores data in `links.json`

---

## 🛠️ Tech Stack

- Node.js (`http`, `fs/promises`, `path`, `crypto`)
- HTML + CSS (Frontend)
- JSON file as database

---

## 🚀 How to Run

```bash
node app.js


http://localhost:3008


url/
├── app.js
├── data/
│   └── links.json
├── public/
│   ├── index.html
│   └── style.css
├── .gitignore
└── README.md

API Endpoints
POST /shorten → Create short URL

GET /<shortcode> → Redirect to original URL

GET /links → Get all saved links (JSON)

Author
Arvind Meena
