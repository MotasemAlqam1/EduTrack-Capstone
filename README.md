<div align="center">

# 🎓 EduTrack

**A Student Progress Tracking SaaS for Instructors**

Manage students, courses, assessments, and learning resources from one dashboard with light and dark mode.

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

## 📖 About

EduTrack is a JavaScript capstone project built for instructors to manage student progress.

Each instructor can register, log in, and access only their own students, courses, assessments, and resources.

The project uses HTML, CSS, Bootstrap, Vanilla JavaScript with ES modules, and `json-server` as a mock REST API.

---

## 🖼️ Screenshots

| Light Mode | Dark Mode |
| :---: | :---: |
| ![Light mode](images/lightMode.png) | ![Dark mode](images/darkMode.png) |

---

## ✨ Features

### 🔐 Authentication
- Register and login
- Duplicate email validation
- Protected pages
- Session persistence
- Show / hide password

### 📊 Dashboard
- Active students
- Average grades
- Students needing attention
- Grade distribution
- Course averages

### 👩‍🎓 Students
- Add, edit, and soft delete students
- Filter by status and course
- Export to CSV

### 📚 Courses
- Add, edit, and delete courses
- Courses are separated by instructor

### 📝 Assessments
- Create, edit, and delete assessments
- Filter by type and course
- Automatic Active / Ended status
- Export to CSV

### 🎬 Resources
- Add videos, PDFs, and links
- Search YouTube videos
- Search Open Library resources
- Resources linked to courses

### 🎨 UI / UX
- Light and dark mode
- Responsive design
- Profile editing
- Sidebar shortcuts

---

## 🛠️ Tech Stack

| Layer | Tools |
| --- | --- |
| Front End | HTML5, CSS3, Bootstrap 5.3 |
| JavaScript | Vanilla JavaScript, ES Modules, Fetch API, Async/Await |
| Back End | JSON Server |
| External APIs | YouTube Data API v3, Open Library API |
| Tools | Git, GitHub, VS Code |
| Planning | Figma, Trello, Notion |

---

## 📁 Project Structure

```text
EduTrack-Capstone/
├── index.html
├── landing.html
├── db.json
├── pages/
│   ├── index.html
│   ├── dashboard.html
│   ├── students.html
│   ├── courses.html
│   ├── assessments.html
│   └── resources.html
├── js/
│   ├── session.js
│   ├── login.js
│   ├── register.js
│   ├── dashboard.js
│   ├── student.js
│   ├── courses.js
│   ├── assessments.js
│   ├── resources.js
│   ├── profile.js
│   ├── theme.js
│   └── utils.js
├── css/
├── images/
├── err/
└── .gitignore
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/MotasemAlqam1/EduTrack-Capstone.git
cd EduTrack-Capstone
```

### 2. Create the YouTube API config

Create:

```text
js/config.js
```

Then add:

```js
export const YT_KEY = "YOUR_YOUTUBE_API_KEY";
```

### 3. Start JSON Server

```bash
npx json-server db.json
```

On Windows, if PowerShell blocks `npx`:

```bash
npx.cmd json-server db.json
```

The API runs on:

```text
http://localhost:3000
```

### 4. Run the front end

Open `index.html` using Live Server.

---

## 🗄️ API Endpoints

| Endpoint | Description |
| --- | --- |
| `/instructors` | Instructor accounts |
| `/students` | Students and grades |
| `/courses` | Instructor courses |
| `/assessments` | Assessments |
| `/resources` | Videos, PDFs, and links |

Each record uses `instructorId` so instructors only access their own data.

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
