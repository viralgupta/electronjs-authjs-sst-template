import { signOut, useSession } from "next-auth/react"
import React from "react";

const User = () => {
  const { data, status } = useSession();
  if (status == "loading" || status == "unauthenticated") return null;
  const [message, setMessage] = React.useState("")

  React.useEffect(() => {
    fetch(import.meta.env.VITE_API_BASE_URL + "/api/protected").then(async (res) => {
      if (res.ok) {
        await res.json().then(data => setMessage(data.message));
      }
    })
  }, [])

  return (
    <div className="text-center space-y-4">
      <div className="font-bold text-2xl">This if Protected Component</div>
      {data && (
        <div className="italic">
          <div>User Name: {data.user?.name}</div>
          <div>User Email: {data.user?.email}</div>
          <div>Session Expires At: {data.expires}</div>
          <div className="mt-4">
            Message: {message}
          </div>
        </div>
      )}
      <button onClick={() => signOut()} className="px-4 py-2 rounded-md mt-3">
        Logout
      </button>
    </div>
  )
}

export default User