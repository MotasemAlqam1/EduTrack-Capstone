const COURSES = [
  { name: "Web Development", color: "var(--g5)" },
  { name: "JavaScript", color: "var(--blue)" },
  { name: "Databases", color: "var(--amber)" },
  { name: "UI Design", color: "#8b7cf6" },
];
 
const c = (name, grade) => ({ name, grade }); // short helper
 
// TODO: add isDeleted
const students = [
  { id: 8,  instructorId: 1, studentId: "STU008", name: "Tariq",  email: "tariq@gmail.com",  phone: "0790000008", courses: [c("Web Development", 30),  c("JavaScript", 34)],      status: "active" },
  { id: 9,  instructorId: 1, studentId: "STU009", name: "Maya",   email: "maya@gmail.com",   phone: "0790000009", courses: [c("JavaScript", 90),       c("UI Design", 86)],       status: "active" },
  { id: 10, instructorId: 1, studentId: "STU010", name: "Khaled", email: "khaled@gmail.com", phone: "0790000010", courses: [c("Web Development", 100), c("Databases", 100)],      status: "active" },
  { id: 11, instructorId: 1, studentId: "STU011", name: "Rania",  email: "rania@gmail.com",  phone: "0790000011", courses: [c("Web Development", 70),  c("UI Design", 66)],       status: "active" },
  { id: 12, instructorId: 1, studentId: "STU012", name: "Zaid",   email: "zaid@gmail.com",   phone: "0790000012", courses: [c("JavaScript", 46),       c("Databases", 54)],       status: "active" },
  { id: 13, instructorId: 1, studentId: "STU013", name: "Huda",   email: "huda@gmail.com",   phone: "0790000013", courses: [c("Databases", 75),        c("UI Design", 79)],       status: "active" },
  { id: 14, instructorId: 1, studentId: "STU014", name: "Sami",   email: "sami@gmail.com",   phone: "0790000014", courses: [c("Web Development", 82),  c("JavaScript", 86)],      status: "active" },
  { id: 15, instructorId: 1, studentId: "STU015", name: "Reem",   email: "reem@gmail.com",   phone: "0790000015", courses: [c("JavaScript", 95),       c("UI Design", 91)],       status: "active" },
  { id: 16, instructorId: 1, studentId: "STU016", name: "Fadi",   email: "fadi@gmail.com",   phone: "0790000016", courses: [c("Databases", 39),        c("Web Development", 43)], status: "active" },
  { id: 17, instructorId: 1, studentId: "STU017", name: "Mona",   email: "mona@gmail.com",   phone: "0790000017", courses: [c("UI Design", 65),        c("JavaScript", 61)],      status: "active" },
  { id: 18, instructorId: 1, studentId: "STU018", name: "Bilal",  email: "bilal@gmail.com",  phone: "0790000018", courses: [c("Web Development", 81),  c("Databases", 77)],       status: "active" },
  { id: 19, instructorId: 1, studentId: "STU019", name: "Nour",   email: "nour@gmail.com",   phone: "0790000019", courses: [c("UI Design", 88),        c("Databases", 84)],       status: "active" },
  { id: 20, instructorId: 1, studentId: "STU020", name: "Salma",  email: "salma@gmail.com",  phone: "0790000020", courses: [c("Web Development", 96),  c("UI Design", 100)],      status: "active" },
  { id: 21, instructorId: 1, studentId: "STU021", name: "Karim",  email: "karim@gmail.com",  phone: "0790000021", courses: [c("JavaScript", 60),       c("Databases", 56)],       status: "active" },
  { id: 22, instructorId: 1, studentId: "STU022", name: "Laila",  email: "laila@gmail.com",  phone: "0790000022", courses: [c("Web Development", 73),  c("JavaScript", 69)],      status: "active" },
  { id: 23, instructorId: 1, studentId: "STU023", name: "Hasan",  email: "hasan@gmail.com",  phone: "0790000023", courses: [c("Databases", 47),        c("UI Design", 51)],       status: "active" },
  { id: 24, instructorId: 1, studentId: "STU024", name: "Jana",   email: "jana@gmail.com",   phone: "0790000024", courses: [c("Web Development", 84),  c("UI Design", 80)],       status: "active" },
  { id: 25, instructorId: 1, studentId: "STU025", name: "Wael",   email: "wael@gmail.com",   phone: "0790000025", courses: [c("JavaScript", 68),       c("Databases", 64)],       status: "active" },
  { id: 26, instructorId: 1, studentId: "STU026", name: "Dina",   email: "dina@gmail.com",   phone: "0790000026", courses: [c("Web Development", 92),  c("JavaScript", 88)],      status: "active" },
  { id: 27, instructorId: 1, studentId: "STU027", name: "Hamza",  email: "hamza@gmail.com",  phone: "0790000027", courses: [c("UI Design", 35),        c("Databases", 39)],       status: "active" },
];
 
const ATTENTION_GRADE = 60; // below 60 needs attention
// const ATTENTION_ATTENDANCE = 75; // below 75 needs attention
 
const average = (arr) =>
  arr.length ? arr.reduce((sum, n) => sum + n, 0) / arr.length : 0;
 
// Each student's grade = average of their course grades (must run before the stats)
students.forEach((s) => {
  s.grade = Math.round(average(s.courses.map((x) => x.grade)));
});
 
const needAttention = students.filter(
  (s) => s.grade < ATTENTION_GRADE
  // || s.attendance < ATTENTION_ATTENDANCE
);
 
// ---------- Top stats ----------
document.getElementById("state-active").textContent = students.length;
document.getElementById("state-avg-grade").textContent =
  `${Math.round(average(students.map((s) => s.grade)))}%`;
// document.getElementById("state-attendance").textContent =
//   `${Math.round(average(students.map((s) => s.attendance)))}%`;
document.getElementById("state-attention").textContent = needAttention.length;
 
// ---------- Grade distribution ----------
const distribution = {
  "0-49": 0,
  "50-59": 0,
  "60-69": 0,
  "70-79": 0,
  "80-89": 0,
  "90-100": 0,
};
 
students.forEach((s) => {
  if (s.grade <= 49) distribution["0-49"]++;
  else if (s.grade <= 59) distribution["50-59"]++;
  else if (s.grade <= 69) distribution["60-69"]++;
  else if (s.grade <= 79) distribution["70-79"]++;
  else if (s.grade <= 89) distribution["80-89"]++;
  else distribution["90-100"]++;
});
 
// Bar heights are relative to the biggest group (1 avoids dividing by 0)
const maxCount = Math.max(...Object.values(distribution), 1);
 
Object.entries(distribution).forEach(([range, count]) => {
  document.getElementById(`grade-${range}`).textContent = count;
  document.getElementById(`bar-${range}`).style.height =
    `${(count / maxCount) * 100}%`;
});
 
// ---------- Average by course ----------
document.getElementById("course-averages").innerHTML = COURSES.map((course) => {
  const grades = students.flatMap((s) =>
    s.courses.filter((x) => x.name === course.name).map((x) => x.grade)
  );
  const avg = Math.round(average(grades));
  return `
    <div class="hbar">
      <span class="n">${course.name}</span>
      <div class="prog">
        <span style="width: ${avg}%; background: ${course.color}"></span>
      </div>
      <span class="v">${avg}%</span>
    </div>`;
}).join("");