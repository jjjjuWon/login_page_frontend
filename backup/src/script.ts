import { User, LoginResponse } from './types';

const API_BASE = "https://backend-solitary-sun-4121.fly.dev";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm") as HTMLFormElement;
  const signinForm = document.getElementById("signinForm") as HTMLFormElement;
  const signUpBtn = document.getElementById("signUp") as HTMLButtonElement;
  const signInBtn = document.getElementById("signIn") as HTMLButtonElement;
  const container = document.querySelector(".container") as HTMLDivElement;

  signupForm.addEventListener("submit", function (e: Event) {
    e.preventDefault();
    const name = (document.getElementById("signupName") as HTMLInputElement).value;
    const email = (document.getElementById("signupEmail") as HTMLInputElement).value;
    const pw = (document.getElementById("signupPassword") as HTMLInputElement).value;

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
      .then((data: LoginResponse) => {
        console.log("회원가입 응답 데이터:", data);
        alert(data.message);
      })
      .catch((error) => {
        console.error("회원가입 에러:", error);
        alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      });
  });

  signinForm.addEventListener("submit", function (e: Event) {
    e.preventDefault();
    const email = (document.getElementById("signinEmail") as HTMLInputElement).value;
    const pw = (document.getElementById("signinPassword") as HTMLInputElement).value;

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
      .then((data: LoginResponse) => {
        console.log("로그인 응답 데이터:", data);
        alert(data.message);
        if (data.token && data.name) {
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

  signUpBtn.addEventListener("click", () => {
    container.classList.add("right-panel-active");
  });

  signInBtn.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
  });
}); 