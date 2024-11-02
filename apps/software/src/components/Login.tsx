import { signIn } from "next-auth/react";
import React from "react";

const LoginButton = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <div className="flex gap-2 mt-4">
      <div className="flex flex-col text-lg">
        <div>Email</div>
        <input type="text" placeholder="demo@email.com" onChange={(e) => setEmail(e.target.value ?? "")} value={email}/>
      </div>
      <div className="flex flex-col text-lg">
        <div>Password</div>
        <input type="text" placeholder="password" onChange={(e) => setPassword(e.target.value ?? "")} value={password}/>
      </div>
      <button
        onClick={() => signIn("credentials", {
          redirect: false,
          Email: email,
          Password: password,
        })}
        className="px-4 py-2 rounded-md"
      >
        Login
      </button>
    </div>
  );
};

export default LoginButton;
