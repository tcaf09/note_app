import { useState } from "react";

function LoginSignup() {
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
          className="p-2 rounded-lg focus:outline-none"
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
          className="p-2 rounded-lg focus:outline-none"
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
          className="p-2 rounded-lg focus:outline-none"
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
          className="p-2 rounded-lg focus:outline-none"
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
          className="p-2 rounded-lg focus:outline-none"
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
          className="p-2 rounded-lg focus:outline-none"
        />
      </div>
    </>
  );

  const toggleOption = (option: "login" | "signup") => {
    setOption(option);
  };

  const [option, setOption] = useState<"login" | "signup">("login");

  return (
    <div className="flex items-center justify-center h-screen">
      <div className=" bg-black w-auto h-2/3 rounded-[25px] flex flex-col items-center justify-between px-10 py-5">
        <div className="flex rounded-full bg-white justify-between w-full p-1">
          <p
            onClick={() => toggleOption("login")}
            className={`cursor-pointer rounded-full ${
              option === "login" ? "bg-black text-white" : "text-black"
            } px-10 py-2`}
          >
            Login
          </p>
          <p
            className={`cursor-pointer rounded-full px-5 py-2 ${
              option === "signup" ? "bg-black text-white" : "text-black"
            }`}
            onClick={() => {
              toggleOption("signup");
            }}
          >
            Signup
          </p>
        </div>
        <div className="flex flex-col grow justify-evenly">
          {option === "login" ? loginForm : signupForm}
        </div>
        <button className="border-none bg-white w-3/4 rounded-full py-2">
          {option === "login" ? "Login" : "Sign Up"}
        </button>
      </div>
    </div>
  );
}

export default LoginSignup;
