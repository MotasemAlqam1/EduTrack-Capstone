import { API_URL, requireInstructor } from "./session.js";
import { esc, getInitials } from "./utils.js";

// Not logged in -> login page (pages/index.html)
const instructor = requireInstructor("index.html");
const INSTRUCTORID = instructor.id;

// Colors are reused in order when there are more courses than colors
const COURSE_COLORS = [
  "var(--g5)",
  "var(--blue)",
  "var(--amber)",
  "#8b7cf6",
  "#ec4899",
  "#14b8a6",
];

const ATTENTION_GRADE = 60; // below 60 needs attention

const average = (arr) =>
  arr.length ? arr.reduce((sum, n) => sum + n, 0) / arr.length : 0;

// -------- [ DATA ] --------
const getStudents = async (instructorId) => {
  const res = await fetch(`${API_URL}/students?instructorId=${encodeURIComponent(instructorId)}`);
  if (!res.ok) throw new Error(`Failed to load students (${res.status})`);
  const data = await res.json(); // res.json itself is asynchronous
  // Same rule as the Students page: hide soft-deleted, and only count active students
  return data.filter((s) => !s.isDeleted && s.status !== "archived");
};

const getCourses = async (instructorId) => {
  const res = await fetch(`${API_URL}/courses?instructorId=${encodeURIComponent(instructorId)}`);
  if (!res.ok) throw new Error(`Failed to load courses (${res.status})`);
  return (await res.json()).filter((c) => !c.isDeleted);
};

// -------- [ RENDER ] --------
const renderDashboard = (students, courses) => {
  // Each student's grade = average of their course grades (must run before the stats)
  const stdWithGrade = students.map((s) => ({
    ...s,
    grade: Math.round(average((s.courses || []).map((x) => x.grade)))
  }));

  const needAttention = stdWithGrade
    .filter((s) =>s.grade > 1 &&  s.grade < ATTENTION_GRADE);

  // average
  const avg = Math.round(average(stdWithGrade.map((s) => s.grade)))

  // Top stats
  document.getElementById("state-active").textContent = stdWithGrade.length;
  document.getElementById("state-avg-grade").textContent =
    `${avg}%`;
  document.getElementById("state-attention").textContent = needAttention.length;

  // Grade distribution 
  const distribution = {
    "0-49": 0,
    "50-59": 0,
    "60-69": 0,
    "70-79": 0,
    "80-89": 0,
    "90-100": 0,
  };

  stdWithGrade.forEach((s) => {
    if (s.grade <= 49) distribution["0-49"]++;
    else if (s.grade <= 59) distribution["50-59"]++;
    else if (s.grade <= 69) distribution["60-69"]++;
    else if (s.grade <= 79) distribution["70-79"]++;
    else if (s.grade <= 89) distribution["80-89"]++;
    else distribution["90-100"]++;
  });

  // Bar heights are relative to the biggest group (1 avoids dividing by 0)
  const maxCount = Math.max(...Object.values(distribution), 1);

  // Entries return an array of key value.
  Object.entries(distribution).forEach(([range, count]) => {
    document.getElementById(`grade-${range}`).textContent = count;
    document.getElementById(`bar-${range}`).style.height =
      `${(count / maxCount) * 100}%`; // What is the height of the current group
  });

  // Average by course: the instructor's courses + any course name found on a student
  const courseNames = [
    ...new Set([
      ...courses.map((c) => c.name),
      ...students.flatMap((s) => (s.courses || []).map((x) => x.name)),
    ]),
  ];

  document.getElementById("course-averages").innerHTML = courseNames.length
    ? courseNames.map((name, i) => {
        // Every grade of this course, across all students
        //* flatMap => [90, 80] instead of [[90], [80]]
        const grades = students.flatMap((s) =>
          (s.courses || []).filter((x) => x.name === name).map((x) => x.grade)
        );

        // No grades yet -> show a dash instead of a misleading 0%
        const hasGrades = grades.length > 0;
        const courseAvg = Math.round(average(grades));
        return `
      <div class="hbar">
        <span class="n">${esc(name)}</span>
        <div class="prog">
          <span style="width: ${courseAvg}%; background: ${COURSE_COLORS[i % COURSE_COLORS.length]}"></span>
        </div>
        <span class="v">${hasGrades ? `${courseAvg}%` : "–"}</span>
      </div>`;
      }).join("")
    : `<p class="text-muted mb-0">No courses yet</p>`;

  //? Students needing attention (3 lowest grades)
  const topAttention = [...needAttention] // Copy to not sort the original one
  .sort ((a, b) => a.grade - b.grade) // lowest grade first
  .slice (0, 3); // Only first 3

  document.getElementById("attention-list").innerHTML = topAttention.length
    ? topAttention
        .map(
          (s) => `
      <div class="q">
        <span class="av">${getInitials(s.name)}</span>
        <div class="t">
          ${esc(s.name)}<small> Grade ${s.grade}%</small>
        </div>
      </div>`
        )
        .join("")
    : `<p class="text-muted mb-0">No students need attention 🎉</p>`;

    //? Top Performs
    const aboveAvg = stdWithGrade
    .filter ((s) => s.grade > avg && s.grade > 60);

    const topStudents = [...aboveAvg]
    .sort ((a, b) => b.grade - a.grade)
    .slice (0, 3);

    document.getElementById("performers-list").innerHTML = topStudents.length
    ? topStudents
        .map(
          (s) => `
      <div class="q">
        <span class="av">${getInitials(s.name)}</span>
        <div class="t">
          ${esc(s.name)}<small> Grade ${s.grade}%</small>
        </div>
      </div>`
        )
        .join("")
    : `<p class="text-muted mb-0">No students to display</p>`;

}


try {
  const [students, courses] = await Promise.all([
    getStudents(INSTRUCTORID),
    getCourses(INSTRUCTORID),
  ]);
  renderDashboard(students, courses);
} catch (error) {
  console.error("Dashboard error:", error);
  // Show the problem on the page instead of leaving empty cards
  const message = `<p class="text-danger mb-0">Could not load dashboard data: ${esc(error.message)}. Is json-server running?</p>`;
  ["course-averages", "attention-list", "performers-list"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = message;
  });
}