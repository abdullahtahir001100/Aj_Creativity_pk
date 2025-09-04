import React, { useState, useEffect } from "react";
import "../styles/auth.scss"; // Using the external SCSS file again

const MAX_ATTEMPTS = 5;

const AuthForm = ({ onLoginSuccess }) => {
  // --- State for different auth modes ---
  const [authMode, setAuthMode] = useState("login");
  // New modes: 'forgotPassword_enterEmail', 'forgotPassword_enterCode', 'forgotPassword_resetPassword'
  
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

  // Block user for 1 minute if they exceed attempts
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
    setError(""); // Clear previous errors on new submission
    setSuccessMessage("");

    if (isBlocked) {
      setError(`Too many failed attempts. Please try again in 1 minute.`);
      return;
    }

    // --- Handle different form submissions based on the current mode ---
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
      
      case "signup":
        if (!username || !email || !password) {
          setError("Please fill all fields.");
          return;
        }
        setSuccessMessage("Signup successful! You can now log in.");
        setTimeout(() => switchMode("login"), 2000); // Redirect to login after 2s
        break;

      case "forgotPassword_enterEmail":
        if (!email) {
          setError("Please enter your email address.");
          return;
        }
        // In a real app, you would call your backend API here to send the code.
        console.log(`SIMULATING: Sending verification code to ${email}. The code is 123456.`);
        setSuccessMessage("A 6-digit verification code has been sent to your email.");
        setAuthMode("forgotPassword_enterCode");
        break;

      case "forgotPassword_enterCode":
        // This is a hardcoded code for demonstration purposes.
        if (verificationCode === "123456") {
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
        // In a real app, you would call your backend API here to update the password.
        console.log(`SIMULATING: Password for ${email} has been reset to: ${newPassword}`);
        setSuccessMessage("Password has been reset successfully! Redirecting to login...");
        setTimeout(() => switchMode("login"), 2000); // Redirect to login after 2s
        break;

      default:
        break;
    }
  };

  // Helper to switch modes and clear form state
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
    switch (authMode) {
      case 'login':
        return (
          <>
            <div className="auth-header">
              <h2 className="auth-title">Welcome Back</h2>
              <p className="auth-subtitle">Sign in to continue</p>
            </div>
            <div className="input-group"><label className="auth-label" htmlFor="username">Username</label><input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="auth-input" placeholder="e.g., pak123" required /></div>
            <div className="input-group"><label className="auth-label" htmlFor="password">Password</label><input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" placeholder="••••••••" required /></div>
            <div className="auth-options"><a href="#" onClick={() => switchMode('forgotPassword_enterEmail')} className="forgot-password">Forgot Password?</a></div>
            <button type="submit" className="auth-submit-button" disabled={isBlocked}>{isBlocked ? 'Blocked' : 'Login'}</button>
            <p className="auth-switch">Don't have an account? <span onClick={() => switchMode('signup')}>Sign Up</span></p>
          </>
        );
      case 'signup':
         return (
          <>
            <div className="auth-header"><h2 className="auth-title">Create Account</h2><p className="auth-subtitle">Get started with us today!</p></div>
            <div className="input-group"><label className="auth-label" htmlFor="username">Username</label><input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="auth-input" placeholder="Choose a username" required /></div>
            <div className="input-group"><label className="auth-label" htmlFor="email">Email</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" placeholder="you@example.com" required /></div>
            <div className="input-group"><label className="auth-label" htmlFor="password">Password</label><input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" placeholder="Create a strong password" required /></div>
            <button type="submit" className="auth-submit-button">Sign Up</button>
            <p className="auth-switch">Already have an account? <span onClick={() => switchMode('login')}>Login</span></p>
          </>
        );
      case 'forgotPassword_enterEmail':
        return (
          <>
            <div className="auth-header"><h2 className="auth-title">Reset Password</h2><p className="auth-subtitle">We'll send a recovery code to your email</p></div>
            <div className="input-group"><label className="auth-label" htmlFor="email">Email</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" placeholder="Enter your registered email" required /></div>
            <button type="submit" className="auth-submit-button">Send Code</button>
            <p className="auth-switch">Remembered your password? <span onClick={() => switchMode('login')}>Back to Login</span></p>
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