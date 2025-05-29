'use client';

import React, { useState } from 'react';


export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="wrapper">
      <div className={`container ${isSignUp ? 'right-panel-active' : ''}`}>
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

        <div className="overlay-container">
          <div className="overlay-left">
            <h1>Welcome Back</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button
              id="signIn"
              className="overlay_btn"
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </button>
          </div>
          <div className="overlay-right">
            <h1>Hello, Friend</h1>
            <p>Enter your personal details and start journey with us</p>
            <button
              id="signUp"
              className="overlay_btn"
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
