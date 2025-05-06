const API_BASE = "https://study_login_page.onrender.com"; // ← Render에 배포된 주소로 수정

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const pw = document.getElementById("signupPassword").value;

    fetch(`${API_BASE}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, pw }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
      })
      .catch(console.error);
  });

  document.getElementById("signinForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("signinEmail").value;
    const pw = document.getElementById("signinPassword").value;

    fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pw }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("name", data.name);
          window.location.href = "main.html";
        }
      })
      .catch(console.error);
  });

  const signUpBtn = document.getElementById("signUp");
  const signInBtn = document.getElementById("signIn");
  const container = document.querySelector(".container");

  signUpBtn.addEventListener("click", () => {
    container.classList.add("right-panel-active");
  });

  signInBtn.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
  });
});
