const passwordButtons = document.querySelectorAll(".toggle-password");

passwordButtons.forEach(function (button) {

  button.addEventListener("click", function () {

    const inputId = button.dataset.target;
    const input = document.getElementById(inputId);
    const icon = button.querySelector("i");

    if (input.type === "password") {

      input.type = "text";

      icon.classList.remove("bi-eye");
      icon.classList.add("bi-eye-slash");

    } else {

      input.type = "password";

      icon.classList.remove("bi-eye-slash");
      icon.classList.add("bi-eye");

    }

  });

});