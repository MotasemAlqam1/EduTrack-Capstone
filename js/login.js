const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("pw");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  loginError.textContent = "";

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  try {
    const response = await fetch(
      `http://localhost:3000/instructors?email=${encodeURIComponent(email)}`
    );

    const instructors = await response.json();

    if (instructors.length === 0) {
      loginError.textContent = "Email not found";
      return;
    }

    const instructor = instructors[0];

    if (instructor.password !== password) {
      loginError.textContent = "Incorrect password";
      return;
    }

    sessionStorage.setItem("currentInstructor", JSON.stringify(instructor));

    window.location.href = "pages/dashboard.html";

  } catch (error) {
    console.error(error);
    loginError.textContent = "Cannot connect to server";
  }
});