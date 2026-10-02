let instructor = JSON.parse(sessionStorage.getItem("currentInstructor"));

// Protect page
if (!instructor) {
  window.location.href = "../index.html";
}

const instructorName = document.getElementById("instructorName");
const topAvatar = document.getElementById("topAvatar");
const dropdownAvatar = document.getElementById("dropdownAvatar");
const profileAvatar = document.getElementById("profileAvatar");

const dropdownName = document.getElementById("dropdownName");
const dropdownDepartment = document.getElementById("dropdownDepartment");
const dropdownEmail = document.getElementById("dropdownEmail");

const profileForm = document.getElementById("profileForm");
const nameInput = document.getElementById("p-name");
const departmentInput = document.getElementById("p-dept");
const phoneInput = document.getElementById("p-phone");
const emailInput = document.getElementById("p-email");

const profileImageInput = document.getElementById("profileImageInput");

const imageKey = `profileImage_${instructor.id}`;
let selectedImage = localStorage.getItem(imageKey) || "";

// Get initials
function getInitials(name) {
  if (!name) return "";

  const words = name.trim().split(/\s+/);

  return (words[0][0] + (words[1] ? words[1][0] : "")).toUpperCase();
}

// Show avatar
function showAvatar(element, initials) {
  if (selectedImage) {
    element.style.backgroundImage = `url("${selectedImage}")`;
    element.style.backgroundSize = "cover";
    element.style.backgroundPosition = "center";
    element.textContent = "";
  } else {
    element.style.backgroundImage = "none";
    element.textContent = initials;
  }
}

// Show instructor data
function showData() {
  const initials = getInitials(instructor.name);

  instructorName.textContent = instructor.name;

  showAvatar(topAvatar, initials);
  showAvatar(dropdownAvatar, initials);
  showAvatar(profileAvatar, initials);

  dropdownName.textContent = instructor.name;
  dropdownDepartment.textContent = instructor.department || "";
  dropdownEmail.textContent = instructor.email;

  nameInput.value = instructor.name || "";
  departmentInput.value = instructor.department || "";
  phoneInput.value = instructor.phone || "";
  emailInput.value = instructor.email || "";
}

showData();

// Choose image
profileImageInput.addEventListener("change", function () {
  const file = profileImageInput.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please choose an image");
    profileImageInput.value = "";
    return;
  }

  if (file.size > 1024 * 1024) {
    alert("Image must be less than 1MB");
    profileImageInput.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    selectedImage = reader.result;

    showAvatar(profileAvatar, getInitials(instructor.name));
  };

  reader.readAsDataURL(file);
});

// Update profile
profileForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const updatedData = {
    name: nameInput.value.trim(),
    department: departmentInput.value.trim(),
    phone: phoneInput.value.trim(),
  };

  try {
    const response = await fetch(
      `http://localhost:3000/instructors/${instructor.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to update profile");
    }

    instructor = await response.json();

    sessionStorage.setItem("currentInstructor", JSON.stringify(instructor));

    if (selectedImage) {
      localStorage.setItem(imageKey, selectedImage);
    }
    showData();

    alert("Profile updated successfully");

    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Profile Update Error:", error);
    alert("Failed to update profile");
  }
});

// Logout
function logout() {
  sessionStorage.removeItem("currentInstructor");
  window.location.href = "../index.html";
}

const logoutBtn = document.getElementById("logoutBtn");
const sidebarLogout = document.getElementById("sidebarLogout");

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

if (sidebarLogout) {
  sidebarLogout.addEventListener("click", logout);
}

// Change Password
const changePasswordForm = document.getElementById("changePasswordForm");
const currentPasswordInput = document.getElementById("currentPassword");
const newPasswordInput = document.getElementById("newPassword");
const confirmNewPasswordInput = document.getElementById("confirmNewPassword");
const passwordError = document.getElementById("passwordError");

changePasswordForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  passwordError.textContent = "";

  const currentPassword = currentPasswordInput.value.trim();
  const newPassword = newPasswordInput.value.trim();
  const confirmNewPassword = confirmNewPasswordInput.value.trim();

  // Check current password
  if (currentPassword !== instructor.password) {
    passwordError.textContent = "Current password is incorrect";
    return;
  }

  // Check new password length
  if (newPassword.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters";
    return;
  }

  // Check confirm password
  if (newPassword !== confirmNewPassword) {
    passwordError.textContent = "Passwords do not match";
    return;
  }

  // Check same password
  if (newPassword === currentPassword) {
    passwordError.textContent = "New password must be different";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/instructors/${instructor.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to change password");
    }

    instructor = await response.json();

    alert("Password changed successfully. Please login again.");

    sessionStorage.removeItem("currentInstructor");

    window.location.href = "../index.html";
  } catch (error) {
    console.error(error);

    passwordError.textContent = "Failed to change password";
  }
});
 