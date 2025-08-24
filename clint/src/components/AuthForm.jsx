import React, { useState } from 'react';

const AuthForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'abdullah tahir' && password === 'pakistan30') {
      onLoginSuccess();
    } else {
      setError('Invalid username or password.');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (securityAnswer.toLowerCase() === 'apple') {
      setError('Your password is: pakistan30');
    } else {
      setError('Incorrect security answer.');
    }
  };

  return (
    <div style={styles.container} className='body'>
      <div style={styles.formWrapper} className='trans'>
        <h2 style={styles.heading}>{showForgot ? 'Forgot Password' : 'Login'}</h2>
        {!showForgot ? (
          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" style={styles.button}>Login</button>
            <p style={styles.link} onClick={() => setShowForgot(true)}>Forgot Password?</p>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>What is your favorite fruit?</label>
              <input
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" style={styles.button}>Reset Password</button>
            <p style={styles.link} onClick={() => {
              setShowForgot(false);
              setError('');
            }}>Back to Login</p>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  formWrapper: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  heading: {
    marginBottom: '20px',
    color: '#333',
  },
  inputGroup: {
    marginBottom: '15px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#555',
    fontWeight: 'bold',
  },
  input: {
    width: 'calc(100% - 20px)',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '18px',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'background-color 0.3s ease',
  },
  link: {
    color: '#007bff',
    cursor: 'pointer',
    marginTop: '15px',
    fontSize: '14px',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default AuthForm;