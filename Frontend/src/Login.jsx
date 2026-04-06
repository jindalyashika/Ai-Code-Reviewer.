import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";

function Login({ onLogin }) {
  async function handleGoogleLogin() {
    try {
      const result = await signInWithPopup(auth, provider);
      onLogin(result.user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>AI Code Reviewer</h1>
        <p>Review your code with AI-powered feedback</p>
        <button onClick={handleGoogleLogin} className="google-btn">
          <img src="https://www.google.com/favicon.ico" alt="Google" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;