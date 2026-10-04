<div align="center">

# 🎓 EduTrack

**A Student Progress Tracking SaaS for Instructors**

Manage students, courses, assessments, and learning resources from one clean dashboard, in light or dark mode.

<a href="https://motasemalqam1.github.io/EduTrack-Capstone/">🚀 Live Demo</a>
&nbsp;·&nbsp;
<a href="https://www.figma.com/design/cYBe5XA1PwdHCbFRa7am21/EduTrack-%E2%80%94-Wireframes---High-Fidelity?node-id=1-8&p=f&t=H3ZMowtieJqZBG8U-0">🎨 Figma</a>
&nbsp;·&nbsp;
<a href="https://trello.com/invite/b/6abcecb865662416a8f40324/ATTI5b65613ec50cfcd4c0aa28a6439cc1532A937526/capstone-2">📋 Trello</a>
&nbsp;·&nbsp;
<a href="https://app.notion.com/p/LMS-3edde191c21a807d9af0d505ae69e6b8?source=copy_link">📝 Notion</a>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES_Modules-F7DF1E?logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)
![JSON Server](https://img.shields.io/badge/JSON_Server-REST_API-000000)

</div>

---

## 📑 Table of Contents

- [About](#-about)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Data Model](#-data-model)
- [Design & Planning](#-design--planning)
- [Bug Logs (`err/`)](#-bug-logs-err)
- [Team](#-team)

---

## 📖 About

EduTrack is a JavaScript capstone project: a SaaS-style web app that helps instructors track their students' progress. Each instructor signs up, logs in, and sees **only their own** students, courses, assessments, and resources.

The front end is plain HTML, CSS, and vanilla JavaScript (ES modules) styled with Bootstrap. The back end is a mock REST API served by **json-server** from a single `db.json` file.

The original project brief is included in the repo:
`JS Capstone Project 1 EduTrack STUDENTS VERSION - A Student Progress Tracking - SaaS Application.pdf`

---

## 🖼️ Screenshots

| Light Mode | Dark Mode |
| :---: | :---: |
| ![Light mode](images/lightMode.png) | ![Dark mode](images/darkMode.png) |

---

## ✨ Features

### 🔐 Authentication
- Register a new instructor account (duplicate-email check)
- Login with session persistence (`sessionStorage` / `localStorage`)
- Protected pages redirect to the login page when no instructor is signed in
- Show / hide password toggle

### 📊 Dashboard
- Summary cards: active students, average grade, students needing attention (grade below 60)
- Grade distribution chart (0–49, 50–59, … 90–100)
- Average grade per course
- Top 3 students who need attention

### 👩‍🎓 Students
- Full CRUD with modal forms
- Search and filter, status (active / archived), soft delete
- Delete confirmation modal
- Export to CSV

### 📚 Courses
- Full CRUD with modal forms, scoped to the logged-in instructor

### 📝 Assessments
- Full CRUD (create, edit with `PATCH`, delete with confirmation)
- Tabs filtering by type and course
- Status calculated automatically from the due date (Active / Ended)
- Statistics cards and export to CSV

### 🎬 Resources
- Save videos, PDFs, and links per course
- Search YouTube videos directly (YouTube Data API v3)
- Search free books (Open Library / Internet Archive)
- Automatic thumbnails for YouTube links

### 🎨 UI / UX
- Light / dark theme toggle saved across pages
- Profile dropdown with edit-profile modal
- Sidebar **Shortcuts** menu (Add student, New assessment, Add course)
- Responsive layout for desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Tools |
| --- | --- |
| Markup & Styling | HTML5, CSS3 (custom properties in `variables.css`), Bootstrap 5.3.3 |
| Icons | Bootstrap Icons 1.11.3, Font Awesome 6.5.2 |
| Logic | Vanilla JavaScript (ES modules, `async/await`, `fetch`) |
| Mock Back End | json-server (`db.json`) |
| External APIs | YouTube Data API v3, Open Library Search API |
| Dev Tools | VS Code + Live Server, Git & GitHub |
| Design & Planning | Figma, Trello, Notion |

---

## 📁 Project Structure

```
EduTrack-Capstone/
├── index.html              # Redirects to landing.html
├── landing.html            # Public landing page
├── db.json                 # json-server database
├── pages/
│   ├── index.html          # Login / Register
│   ├── dashboard.html
│   ├── students.html
│   ├── courses.html
│   ├── assessments.html
│   └── resources.html
├── js/
│   ├── session.js          # API_URL + logged-in instructor helpers
│   ├── login.js / register.js / passwordToggle.js
│   ├── dashboard.js
│   ├── student.js
│   ├── courses.js
│   ├── assessments.js
│   ├── resources.js
│   ├── profile.js          # Profile dropdown & edit modal
│   ├── theme.js            # Light / dark mode
│   ├── landing.js
│   ├── utils.js
│   └── config.js           # 🔒 Your YouTube API key (git-ignored, create it yourself)
├── css/                    # variables, base, layout, components, modal + one file per page
├── images/                 # Screenshots
├── err/                    # Bug logs per team member
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (for `npx`)
- [VS Code](https://code.visualstudio.com/) with the **Live Server** extension
- A Google account (for the YouTube API key)

### 1. Clone the repository

```bash
git clone https://github.com/MotasemAlqam1/EduTrack-Capstone.git
cd EduTrack-Capstone
```

### 2. Add your YouTube API key

The Resources page searches YouTube, so it needs an API key. The key file is listed in `.gitignore` and is **not** in the repo, so each developer creates their own:

1. Open [Google Cloud Console](https://console.cloud.google.com/) and create a project.
2. Go to **APIs & Services → Library**, search for **YouTube Data API v3**, and click **Enable**.
3. Go to **APIs & Services → Credentials → Create credentials → API key**, then copy the key.
4. Create the file `js/config.js` and paste your key:

```js
// js/config.js
export const YT_KEY = "PASTE_YOUR_API_KEY_HERE";
```

> ⚠️ Never commit this file. It is already ignored by `.gitignore`.

### 3. Start the API server

In a terminal at the project root:

```bash
npx json-server db.json
```

The API runs at **http://localhost:3000**. Keep this terminal open while using the app.

> 💡 **Windows:** if PowerShell says *"running scripts is disabled on this system"*, use:
> ```bash
> npx.cmd json-server db.json
> ```

### 4. Run the front end

Open the project in VS Code, right-click `index.html`, and choose **Open with Live Server**.
It redirects to the landing page, where you can register or log in.

### 🔑 Demo account

| Email | Password |
| --- | --- |
| `testInstructor@gmail.com` | `Test123456` |

---

## 🗄️ Data Model

`db.json` exposes these REST endpoints through json-server:

| Endpoint | Description |
| --- | --- |
| `/instructors` | Registered instructor accounts |
| `/students` | Students, their courses and grades |
| `/courses` | Courses owned by an instructor |
| `/assessments` | Quizzes, assignments, exams, with due dates |
| `/resources` | Videos, PDFs, and links attached to courses |

Every record carries an `instructorId`, and each page fetches with `?instructorId=...`, so instructors only see their own data.

---

## 🎨 Design & Planning

| Tool | What's there |
| --- | --- |
| <a href="https://www.figma.com/design/cYBe5XA1PwdHCbFRa7am21/EduTrack-%E2%80%94-Wireframes---High-Fidelity?node-id=1-8&p=f&t=H3ZMowtieJqZBG8U-0">**Figma**</a> | Design system, wireframes, and high-fidelity mockups (light, dark, mobile) |
| <a href="https://trello.com/invite/b/6abcecb865662416a8f40324/ATTI5b65613ec50cfcd4c0aa28a6439cc1532A937526/capstone-2">**Trello**</a> | First task distribution and initial planning |
| <a href="https://app.notion.com/p/LMS-3edde191c21a807d9af0d505ae69e6b8?source=copy_link">**Notion**</a> | Remaining work, bugs fixed, team rules, and planning |

---

## 🐞 Bug Logs (`err/`)

Each team member documented the bugs they hit and how they solved them. It's a record of what we learned along the way.

| Member | Log |
| --- | --- |
| Ahmad Hwari | [err/ahmad-hwari.md](err/ahmad-hwari.md) |
| Ahmad Kayali | [err/ahmad-kayali.md](err/ahmad-kayali.md) |
| Asmaa Aljazzar | [err/asma.md](err/asma.md) |
| Motasem Alqam | [err/motasem-alqam.md](err/motasem-alqam.md) |
| Nour Alsuht | [err/nour.md](err/nour.md) |

**Common themes:**
- PowerShell blocking `npx` → use `npx.cmd`
- `db.json` broken after merges (missing commas, duplicate keys) → validate JSON after resolving conflicts
- Duplicated HTML documents after merges → keep a single clean version
- Data leaking between instructors → filter every request by `instructorId`
- `PUT` wiping fields on edit → use `PATCH` for partial updates

---

## 👥 Team

| Name | GitHub |
| --- | --- |
| Asmaa Aljazzar | [@asmaa-aljazzar](https://github.com/asmaa-aljazzar) |
| Motasem Alqam | [@MotasemAlqam1](https://github.com/MotasemAlqam1) |
| Ahmad Kayali | [@Kayyali10](https://github.com/Kayyali10) |
| Ahmad Hwari | [@Ahmad-alhwari0](https://github.com/Ahmad-alhwari0) |
| Nour Alsuht | [@nouralsuht](https://github.com/nouralsuht) |

<div align="center">

Made with 💙 as a JavaScript Capstone Project

</div>
