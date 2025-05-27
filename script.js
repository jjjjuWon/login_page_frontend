const API_BASE = "https://login-page-backend.fly.dev";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const pw = document.getElementById("signupPassword").value;

    console.log("회원가입 시도:", { name, email });

    fetch(`${API_BASE}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, pw }),
    })
      .then((res) => {
        console.log("회원가입 응답 상태:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("회원가입 응답 데이터:", data);
        alert(data.message);
      })
      .catch((error) => {
        console.error("회원가입 에러:", error);
        alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      });
  });

  document.getElementById("signinForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("signinEmail").value;
    const pw = document.getElementById("signinPassword").value;

    console.log("로그인 시도:", { email });

    fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pw }),
    })
      .then((res) => {
        console.log("로그인 응답 상태:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("로그인 응답 데이터:", data);
        alert(data.message);
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("name", data.name);
          window.location.href = "main.html";
        }
      })
      .catch((error) => {
        console.error("로그인 에러:", error);
        alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      });
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
