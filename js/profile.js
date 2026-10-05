import { toast } from "./utils.js";

let instructor = JSON.parse(
  sessionStorage.getItem("currentInstructor")
);

// ================================
// Protect Page
// ================================

if (!instructor) {
  window.location.href = "../index.html";
}


// ================================
// Get Elements
// ================================

const instructorName =
  document.getElementById("instructorName");

const topAvatar =
  document.getElementById("topAvatar");

const dropdownAvatar =
  document.getElementById("dropdownAvatar");

const profileAvatar =
  document.getElementById("profileAvatar");


const dropdownName =
  document.getElementById("dropdownName");

const dropdownDepartment =
  document.getElementById("dropdownDepartment");

const dropdownEmail =
  document.getElementById("dropdownEmail");


const profileForm =
  document.getElementById("profileForm");

const nameInput =
  document.getElementById("p-name");

const departmentInput =
  document.getElementById("p-dept");

const phoneInput =
  document.getElementById("p-phone");

const emailInput =
  document.getElementById("p-email");

const phoneError =
  document.getElementById("phoneError");


const profileImageInput =
  document.getElementById("profileImageInput");


// ================================
// Profile Image
// ================================

const imageKey =
  `profileImage_${instructor.id}`;

let selectedImage =
  localStorage.getItem(imageKey) || "";


// ================================
// Get Initials
// ================================

function getInitials(name) {

  if (!name) {
    return "";
  }

  const words =
    name.trim().split(/\s+/);

  return (
    words[0][0] +
    (words[1] ? words[1][0] : "")
  ).toUpperCase();
}


// ================================
// Show Avatar
// ================================

function showAvatar(element, initials) {

  if (!element) {
    return;
  }

  if (selectedImage) {

    element.style.backgroundImage =
      `url("${selectedImage}")`;

    element.style.backgroundSize =
      "cover";

    element.style.backgroundPosition =
      "center";

    element.textContent = "";

  } else {

    element.style.backgroundImage =
      "none";

    element.textContent =
      initials;
  }
}


// ================================
// Show Instructor Data
// ================================

function showData() {

  const initials =
    getInitials(instructor.name);


  if (instructorName) {
    instructorName.textContent =
      instructor.name;
  }


  showAvatar(
    topAvatar,
    initials
  );

  showAvatar(
    dropdownAvatar,
    initials
  );

  showAvatar(
    profileAvatar,
    initials
  );


  if (dropdownName) {

    dropdownName.textContent =
      instructor.name || "";
  }


  if (dropdownDepartment) {

    dropdownDepartment.textContent =
      instructor.department || "";
  }


  if (dropdownEmail) {

    dropdownEmail.textContent =
      instructor.email || "";
  }


  if (nameInput) {

    nameInput.value =
      instructor.name || "";
  }


  if (departmentInput) {

    departmentInput.value =
      instructor.department || "";
  }


  if (phoneInput) {

    phoneInput.value =
      instructor.phone || "";
  }


  if (emailInput) {

    emailInput.value =
      instructor.email || "";
  }
}


showData();


// ================================
// Choose Profile Image
// ================================

if (profileImageInput) {

  profileImageInput.addEventListener(
    "change",
    function () {

      const file =
        profileImageInput.files[0];


      if (!file) {
        return;
      }


      // Must be image
      if (!file.type.startsWith("image/")) {

        toast("Please choose an image", "error");

        profileImageInput.value = "";

        return;
      }


      // Maximum 1MB
      if (file.size > 1024 * 1024) {

        toast("Image must be less than 1MB", "error");

        profileImageInput.value = "";

        return;
      }


      const reader =
        new FileReader();


      reader.onload =
        function () {

          selectedImage =
            reader.result;

          showAvatar(
            profileAvatar,
            getInitials(instructor.name)
          );
        };


      reader.readAsDataURL(file);

    }
  );
}


// ================================
// Jordan Phone Validation
// ================================

function isValidJordanPhone(phone) {

  // Remove spaces and -
  phone =
    phone.replace(/[\s-]/g, "");


  // Local:
  // 0791234567
  // 0781234567
  // 0771234567

  const localPhonePattern =
    /^07[789]\d{7}$/;


  // International:
  // +962791234567
  // +962781234567
  // +962771234567

  const internationalPhonePattern =
    /^\+9627[789]\d{7}$/;


  return (
    localPhonePattern.test(phone) ||
    internationalPhonePattern.test(phone)
  );
}


// ================================
// Update Profile
// ================================

if (profileForm) {

  profileForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      // Clear phone error
      if (phoneError) {

        phoneError.textContent = "";
      }


      const phone =
        phoneInput.value
          .trim()
          .replace(/[\s-]/g, "");


      // ==========================
      // Check Phone
      // ==========================

      if (!isValidJordanPhone(phone)) {

        if (phoneError) {

          phoneError.textContent =
            "Please enter a valid Jordanian phone number: 077, 078, 079 or +962.";
        } else {

          toast(
            "Please enter a valid Jordanian phone number: 077, 078, 079 or +962.",
            "error"
          );
        }

        return;
      }


      const updatedData = {

        name:
          nameInput.value.trim(),

        department:
          departmentInput.value.trim(),

        phone:
          phone
      };


      try {

        const response =
          await fetch(
            `http://localhost:3000/instructors/${instructor.id}`,
            {

              method: "PATCH",

              headers: {

                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(updatedData)

            }
          );


        if (!response.ok) {

          throw new Error(
            "Failed to update profile"
          );
        }


        instructor =
          await response.json();


        sessionStorage.setItem(
          "currentInstructor",
          JSON.stringify(instructor)
        );


        // Save profile image
        if (selectedImage) {

          localStorage.setItem(
            imageKey,
            selectedImage
          );
        }

        toast("Profile updated successfully");
        setTimeout(() => { window.location.href = "dashboard.html"; }, 1200);


      } catch (error) {

        console.error(
          "Profile Update Error:",
          error
        );


        toast(
          "Failed to update profile", "error"
        );
      }

    }
  );
}


// ================================
// Logout
// ================================

function logout() {

  sessionStorage.removeItem(
    "currentInstructor"
  );


  window.location.href =
    "../index.html";
}


const logoutBtn =
  document.getElementById("logoutBtn");

const sidebarLogout =
  document.getElementById("sidebarLogout");


if (logoutBtn) {

  logoutBtn.addEventListener(
    "click",
    logout
  );
}


if (sidebarLogout) {

  sidebarLogout.addEventListener(
    "click",
    logout
  );
}



// ================================
// Change Password
// ================================

const changePasswordForm =
  document.getElementById("changePasswordForm");

const currentPasswordInput =
  document.getElementById("currentPassword");

const newPasswordInput =
  document.getElementById("newPassword");

const confirmNewPasswordInput =
  document.getElementById("confirmNewPassword");

const passwordError =
  document.getElementById("passwordError");


// ================================
// Password Validation
// ================================

function isValidPassword(password) {
  return (
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
}


// ================================
// Live Confirm Password
// ================================

confirmNewPasswordInput.addEventListener(
  "input",
  function () {

    const newPassword =
      newPasswordInput.value;

    const confirmPassword =
      confirmNewPasswordInput.value;


    if (confirmPassword === "") {
      passwordError.textContent = "";
      return;
    }


    if (newPassword === confirmPassword) {

      passwordError.textContent =
        "Passwords match";

      passwordError.style.color =
        "green";

    } else {

      passwordError.textContent =
        "Passwords do not match";

      passwordError.style.color =
        "red";
    }
  }
);


// ================================
// Submit Change Password
// ================================

changePasswordForm.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();

    passwordError.textContent = "";


    const currentPassword =
      currentPasswordInput.value.trim();

    const newPassword =
      newPasswordInput.value.trim();

    const confirmPassword =
      confirmNewPasswordInput.value.trim();


    // Current password
    if (
      currentPassword !==
      instructor.password
    ) {

      passwordError.textContent =
        "Current password is incorrect";

      passwordError.style.color =
        "red";

      return;
    }


    // Password pattern
    if (!isValidPassword(newPassword)) {

      passwordError.textContent =
        "Password must contain at least 6 characters, uppercase, lowercase, number and special character";

      passwordError.style.color =
        "red";

      return;
    }


    // Confirm password
    if (
      newPassword !==
      confirmPassword
    ) {

      passwordError.textContent =
        "Passwords do not match";

      passwordError.style.color =
        "red";

      return;
    }


    // Same old password
    if (
      newPassword ===
      currentPassword
    ) {

      passwordError.textContent =
        "New password must be different from current password";

      passwordError.style.color =
        "red";

      return;
    }


    try {

      const response =
        await fetch(
          `http://localhost:3000/instructors/${instructor.id}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              password: newPassword
            })
          }
        );


      if (!response.ok) {

        const errorText =
          await response.text();

        console.log(
          "Status:",
          response.status
        );

        console.log(
          "Server response:",
          errorText
        );

        throw new Error(
          "Failed to change password"
        );
      }


      // Save updated instructor
      instructor =
        await response.json();


      // Remove login session
      sessionStorage.removeItem(
        "currentInstructor"
      );


      // Go directly to login
      window.location.href =
        "../index.html";


    } catch (error) {

      console.error(
        "Change Password Error:",
        error
      );

      passwordError.textContent =
        "Failed to change password";

      passwordError.style.color =
        "red";
    }
  }
);