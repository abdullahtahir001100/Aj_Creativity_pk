import React, { useState, useEffect } from "react";
import "../styles/auth.scss"; // External SCSS file istemal karein

const MAX_ATTEMPTS = 5;

const AuthForm = ({ onLoginSuccess }) => {
  // --- State for different auth modes ---
  const [authMode, setAuthMode] = useState("login");
  
  // --- Form input states ---
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- Login attempt & error states ---
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // User ko 1 minute ke liye block karne ka logic
  useEffect(() => {
    if (loginAttempts >= MAX_ATTEMPTS) {
      setIsBlocked(true);
      setError(`Too many failed attempts. Please try again in 1 minute.`);
      const timer = setTimeout(() => {
        setIsBlocked(false);
        setLoginAttempts(0);
        setError("");
      }, 60000);
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [loginAttempts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (isBlocked) {
      setError(`Too many failed attempts. Please try again in 1 minute.`);
      return;
    }

    switch (authMode) {
      case "login":
        if (username === "pak123" && password === "pakistan30") {
          onLoginSuccess();
        } else {
          const attemptsLeft = MAX_ATTEMPTS - (loginAttempts + 1);
          setLoginAttempts(prev => prev + 1);
          setError(`Invalid credentials. ${attemptsLeft > 0 ? `${attemptsLeft} attempts remaining.` : 'You are now blocked.'}`);
        }
        break;
      
      case "forgotPassword_enterEmail":
        if (!email) {
          setError("Please enter your email address.");
          return;
        }
        console.log(`SIMULATING: Sending verification code to ${email}. The code is 123456.`);
        setSuccessMessage("A 6-digit verification code has been sent to your email.");
        setAuthMode("forgotPassword_enterCode");
        break;

      case "forgotPassword_enterCode":
        // ✅ YAHAN TABDEELI KI GAYI HAI: .trim() add kiya gaya hai
        if (verificationCode.trim() === "12345677") {
          setSuccessMessage("Verification successful! Please set a new password.");
          setAuthMode("forgotPassword_resetPassword");
        } else {
          setError("Invalid verification code. Please try again.");
        }
        break;

      case "forgotPassword_resetPassword":
        if (!newPassword || !confirmPassword) {
          setError("Please fill both password fields.");
          return;
        }
        if (newPassword !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }
        console.log(`SIMULATING: Password for ${email} has been reset to: ${newPassword}`);
        setSuccessMessage("Password has been reset successfully! Redirecting to login...");
        setTimeout(() => switchMode("login"), 2000);
        break;

      default:
        break;
    }
  };

  // Switch mode and clear form state
  const switchMode = (mode) => {
    setAuthMode(mode);
    setUsername("");
    setPassword("");
    setEmail("");
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccessMessage("");
  };

  const renderFormContent = () => {
    // The JSX for rendering forms remains unchanged
    // ... (rest of the render function is the same as before)
     switch (authMode) {
      case 'login':
        return (
          <>
            <div className="auth-header">
              <h2 className="auth-title"><img src="../imgs - Copy/logo.svg" alt=""style={{ width: '103px' }} /></h2>
              <p className="auth-subtitle">Sign in to continue</p>
            </div>
            <div className="input-group"><label className="auth-label" htmlFor="username">Username</label><input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="auth-input" placeholder="e.g., pak123" required /></div>
            <div className="input-group"><label className="auth-label" htmlFor="password">Password</label><input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" placeholder="••••••••" required /></div>
            <div className="auth-options">
              <a 
                href="#" 
                onClick={(event) => {
                  event.preventDefault();
                  switchMode('forgotPassword_enterEmail');
                }} 
                className="forgot-password"
              >
                Forgot Password?
              </a>
            </div>
            <button type="submit" className="auth-submit-button" disabled={isBlocked}>{isBlocked ? 'Blocked' : 'Login'}</button>
          </>
        );
      case 'forgotPassword_enterEmail':
        return (
          <>
            <div className="auth-header"><h2 className="auth-title">Reset Password</h2><p className="auth-subtitle">We'll send a recovery code to your email</p></div>
            <div className="input-group"><label className="auth-label" htmlFor="email">Email</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" placeholder="Enter your registered email" required /></div>
            <button type="submit" className="auth-submit-button">Send Code</button>
            <p className="auth-switch"><span onClick={() => switchMode('login')}>Back to Login</span></p>
          </>
        );
      case 'forgotPassword_enterCode':
        return (
          <>
            <div className="auth-header"><h2 className="auth-title">Enter Verification Code</h2><p className="auth-subtitle">Check your email for the 6-digit code we sent to <br/><strong>{email}</strong></p></div>
            <div className="input-group"><label className="auth-label" htmlFor="code">Verification Code</label><input type="text" id="code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="auth-input" placeholder="e.g., 123456" required /></div>
            <button type="submit" className="auth-submit-button">Verify Code</button>
            <p className="auth-switch"><span onClick={() => switchMode('forgotPassword_enterEmail')}>Use a different email</span></p>
          </>
        );
      case 'forgotPassword_resetPassword':
        return (
          <>
            <div className="auth-header"><h2 className="auth-title">Set New Password</h2><p className="auth-subtitle">Create a new, strong password for your account.</p></div>
            <div className="input-group"><label className="auth-label" htmlFor="newPassword">New Password</label><input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="auth-input" placeholder="••••••••" required /></div>
            <div className="input-group"><label className="auth-label" htmlFor="confirmPassword">Confirm New Password</label><input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="auth-input" placeholder="••••••••" required /></div>
            <button type="submit" className="auth-submit-button">Reset Password</button>
            <p className="auth-switch"><span onClick={() => switchMode('login')}>Back to Login</span></p>
          </>
        );
      default: return null;
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <form onSubmit={handleSubmit} className="auth-form">
          {renderFormContent()}
          {error && <p className="auth-error">{error}</p>}
          {successMessage && <p className="auth-success">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default AuthForm;