import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginSignup() {
  const userRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const confPasswordRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const loginForm = (
    <>
      <div>
        <label htmlFor="username" className="text-white">
          Username:
        </label>
        <br />
        <input
          type="text"
          id="username"
          className="p-2 rounded-lg bg-white focus:outline-none"
          ref={userRef}
        />
      </div>
      <div>
        <label htmlFor="password" className="text-white">
          Password
        </label>
        <br />
        <input
          type="password"
          id="password"
          className="p-2 rounded-lg bg-white focus:outline-none"
          ref={passwordRef}
        />
      </div>
    </>
  );

  const signupForm = (
    <>
      <div>
        <label htmlFor="email" className="text-white">
          Email:
        </label>
        <br />
        <input
          type="email"
          id="email"
          className="p-2 rounded-lg bg-white focus:outline-none"
          ref={emailRef}
        />
      </div>
      <div>
        <label htmlFor="username" className="text-white">
          Username:
        </label>
        <br />
        <input
          type="text"
          id="username"
          className="p-2 rounded-lg bg-white focus:outline-none"
          ref={userRef}
        />
      </div>
      <div>
        <label htmlFor="password" className="text-white">
          Password:
        </label>
        <br />
        <input
          type="password"
          id="password"
          className="p-2 rounded-lg bg-white focus:outline-none"
          ref={passwordRef}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="text-white">
          Confirm Password:
        </label>
        <br />
        <input
          type="password"
          id="confirmPassword"
          className="p-2 rounded-lg bg-white focus:outline-none"
          ref={confPasswordRef}
        />
      </div>
    </>
  );

  const toggleOption = (option: "login" | "signup") => {
    setOption(option);
    setError(null);
  };

  const [option, setOption] = useState<"login" | "signup">("login");
  async function login(username: string, password: string) {
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      localStorage.setItem("token", data.accessToken);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  }

  async function signUp(username: string, password: string, email: string) {
    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      if (!res.ok) throw new Error("Signup Failed");
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className=" bg-black w-auto h-2/3 rounded-[25px] flex flex-col items-center justify-between px-24 py-5">
        <div className="flex rounded-full bg-white justify-between w-full p-1">
          <p
            onClick={() => toggleOption("login")}
            className={`cursor-pointer rounded-full ${option === "login" ? "bg-black text-white" : "text-black"
              } px-10 py-2`}
          >
            Login
          </p>
          <p
            className={`cursor-pointer rounded-full px-5 py-2 ${option === "signup" ? "bg-black text-white" : "text-black"
              }`}
            onClick={() => {
              toggleOption("signup");
            }}
          >
            Signup
          </p>
        </div>
        <div className="h-12 w-full mb-4">
          {error && (
            <div className="p-1 border border-red-900 rounded-lg my-10 bg-red-900/20 text-red-900">
              {error}
            </div>
          )}
        </div>
        <div className="flex flex-col grow justify-evenly">
          {option === "login" ? loginForm : signupForm}
        </div>
        <button
          className="border-none bg-white w-3/4 rounded-full py-2 my-5 cursor-pointer"
          onClick={() => {
            if (option === "login" && userRef.current && passwordRef.current) {
              login(userRef.current.value, passwordRef.current.value);
            }
            if (
              option === "signup" &&
              userRef.current &&
              emailRef.current &&
              passwordRef.current &&
              confPasswordRef.current
            ) {
              if (passwordRef.current.value === confPasswordRef.current.value) {
                signUp(
                  userRef.current.value,
                  passwordRef.current.value,
                  emailRef.current.value,
                );
              } else {
                setError("Passwords must match");
              }
            } else {
              setError("All feilds required");
            }
          }}
        >
          {option === "login" ? "Login" : "Sign Up"}
        </button>
      </div>
    </div>
  );
}

export default LoginSignup;
