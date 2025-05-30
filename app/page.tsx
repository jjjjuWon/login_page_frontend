'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = 'https://backend-solitary-sun-4121.fly.dev';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const signUpForm = document.getElementById('signupForm') as HTMLFormElement;
    const signInForm = document.getElementById('signinForm') as HTMLFormElement;

    if (signUpForm) {
      signUpForm.onsubmit = async (e) => {
        e.preventDefault();
        const name = (document.getElementById('signupName') as HTMLInputElement).value;
        const email = (document.getElementById('signupEmail') as HTMLInputElement).value;
        const pw = (document.getElementById('signupPassword') as HTMLInputElement).value;

        try {
          const res = await fetch(`${API_BASE}/api/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, pw }),
          });
          const data = await res.json();
          alert(data.message || '회원가입 완료!');
        } catch (err) {
          console.error('회원가입 실패:', err);
          alert('회원가입 중 오류 발생');
        }
      };
    }

    if (signInForm) {
      signInForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = (document.getElementById('signinEmail') as HTMLInputElement).value;
        const pw = (document.getElementById('signinPassword') as HTMLInputElement).value;

        try {
          const res = await fetch(`${API_BASE}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, pw }),
          });
          const data = await res.json();
          if (res.ok && data.token) {
            alert(data.message || '로그인 성공!');
            localStorage.setItem('token', data.token);
            localStorage.setItem('name', data.name || email);
            router.push('/chat');
          } else {
            alert(data.message || '로그인 실패');
          }
        } catch (err) {
          console.error('로그인 실패:', err);
          alert('서버 오류 또는 네트워크 문제');
        }
      };
    }
  }, [router]);

  return (
    <div className="wrapper">
      <div className={`container ${isSignUp ? 'right-panel-active' : ''}`}>
        {/* Sign-up */}
        <div className="sign-up-container">
          <form id="signupForm">
            <h1>Create Account</h1>
            <div className="social-links">
              <div><a href="#"><i className="fa fa-facebook"></i></a></div>
              <div><a href="#"><i className="fa fa-twitter"></i></a></div>
              <div><a href="#"><i className="fa fa-linkedin"></i></a></div>
            </div>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Name" id="signupName" required />
            <input type="email" placeholder="Email" id="signupEmail" required />
            <input type="password" placeholder="Password" id="signupPassword" required />
            <button className="form_btn" type="submit">Sign Up</button>
          </form>
        </div>

        {/* Sign-in */}
        <div className="sign-in-container">
          <form id="signinForm">
            <h1>Sign In</h1>
            <div className="social-links">
              <div><a href="#"><i className="fa fa-facebook"></i></a></div>
              <div><a href="#"><i className="fa fa-twitter"></i></a></div>
              <div><a href="#"><i className="fa fa-linkedin"></i></a></div>
            </div>
            <span>or use your account</span>
            <input type="email" placeholder="Email" id="signinEmail" required />
            <input type="password" placeholder="Password" id="signinPassword" required />
            <button className="form_btn" type="submit">Sign In</button>
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay-left">
            <h1>Welcome Back</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button id="signIn" className="overlay_btn" onClick={() => setIsSignUp(false)}>
              Sign In
            </button>
          </div>
          <div className="overlay-right">
            <h1>Hello, Friend</h1>
            <p>Enter your personal details and start journey with us</p>
            <button id="signUp" className="overlay_btn" onClick={() => setIsSignUp(true)}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
