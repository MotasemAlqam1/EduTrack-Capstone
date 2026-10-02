// TODO: add isDeleted to checks
const API_URL = "http://localhost:3000";
const INSTRUCTORID = 1; // Todo: the logged-in instructor's id.

const COURSES = [
  { name: "Web Development", color: "var(--g5)" },
  { name: "JavaScript", color: "var(--blue)" },
  { name: "Databases", color: "var(--amber)" },
  { name: "UI Design", color: "#8b7cf6" },
];

const ATTENTION_GRADE = 60; // below 60 needs attention

const average = (arr) =>
  arr.length ? arr.reduce((sum, n) => sum + n, 0) / arr.length : 0;

// -------- [ Students DATA ] --------
const getStudents = async (instructorId) => {
  const res = await fetch(`${API_URL}/students?instructorId=${instructorId}`);
  if (!res.ok) throw new Error(`Faild to load studnets (${res.status})`);
  const data = await res.json(); // res.json itself is asynchronous
  return data;
}

// -------- [ RENDER ] --------
const renderDashboard = (students) => {

  // Each student's grade = average of their course grades (must run before the stats)
  const stdWithGrade = students.map((s) => ({
    ...s,
    grade: Math.round(average(s.courses.map((x) => x.grade)))
  }));

  const needAttention = stdWithGrade
    .filter((s) => s.grade < ATTENTION_GRADE);

  // Top stats
  document.getElementById("state-active").textContent = stdWithGrade.length;
  document.getElementById("state-avg-grade").textContent =
    `${Math.round(average(stdWithGrade.map((s) => s.grade)))}%`;
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

  Object.entries(distribution).forEach(([range, count]) => {
    document.getElementById(`grade-${range}`).textContent = count;
    document.getElementById(`bar-${range}`).style.height =
      `${(count / maxCount) * 100}%`; // What is the height of the current group
  });

  // Average by course 
  document.getElementById("course-averages").innerHTML = COURSES.map((course) => { // Will write for each course
    // Does the student have the course I want? -> courses.filter
    // Give me the grade.
    // Who is the student? -> s
    //! Without flatMap => [[90], [80]]
    //* With flatMap => [90, 80]
    const grades = students.flatMap((s) => //?flatMap: flattens the array that its callback returns by one level.
      s.courses.filter((x) => x.name === course.name).map((x) => x.grade)
    );

    // Display the average
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

  // Students needing attention (3 lowest grades)

  // First character form both first and last name
  const getInitials = (name) => {
    const parts = name.trim().split (/\s+/);

    if (parts.length == 1)
      return parts[0][0].toUpperCase ();

    return (
      parts[0][0] + parts[parts.length - 1][0] // Only firstname and lastname
    ).toUpperCase ();
  }

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
          ${s.name}<small> grade ${s.grade}%</small>
        </div>
      </div>`
        )
        .join("")
    : `<p class="text-muted mb-0">No students need attention 🎉</p>`;

}


const init = async () => {
  const students = await getStudents(INSTRUCTORID);
  renderDashboard(students);
}

init();