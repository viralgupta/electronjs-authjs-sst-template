import { useSession } from "next-auth/react";
import React from "react";
import LoginButton from "./components/Login";

function ProtectedBody({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  return (
    <div className="App">
      {status == "authenticated" ? (
        <div className="p-10 pb-0 w-full h-full">{children}</div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full font-mono uppercase text-3xl italic p-10">
          Not Authenticated
          <LoginButton/>
        </div>
      )}
    </div>
  );
}

export default ProtectedBody;
