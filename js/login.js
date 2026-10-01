const loginForm =
  document.getElementById("loginForm");

const emailInput =
  document.getElementById("email");

const passwordInput =
  document.getElementById("pw");

const loginError =
  document.getElementById("loginError");


loginForm.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();


    const email =
      emailInput.value.trim();

    const password =
      passwordInput.value.trim();


    const response = await fetch(
      `http://localhost:3000/instructors?email=${encodeURIComponent(email)}`
    );


    const instructors =
      await response.json();


    // Email not found
    if (instructors.length === 0) {

      loginError.textContent =
        "Email not found";

      return;
    }


    const instructor =
      instructors[0];


    // Wrong password
    if (instructor.password !== password) {

      loginError.textContent =
        "Incorrect password";

      return;
    }


    // Save logged-in instructor
    sessionStorage.setItem(
      "currentInstructor",
      JSON.stringify(instructor)
    );


    // Go to dashboard
    window.location.href =
      "pages/dashboard.html";

  }
);