import { useSession, signOut } from "next-auth/react";
import { Button } from "../ui/button";

const Logout = () => {
  const { status } = useSession();

  if(status == "loading" || status == "unauthenticated") return null;

  const handleLogout = async () => {
    await signOut();
  };

  return <Button onClick={handleLogout} variant={"destructive"}>Logout&nbsp;<LogoutIcon/></Button>;
};

const LogoutIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-full aspect-square fill-primary-foreground" id="logout">
      <g>
        <g>
          <rect
            width="24"
            height="24"
            opacity="0"
            transform="rotate(90 12 12)"
          />
          <path d="M7 6a1 1 0 0 0 0-2H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2H6V6zM20.82 11.42l-2.82-4a1 1 0 0 0-1.39-.24 1 1 0 0 0-.24 1.4L18.09 11H10a1 1 0 0 0 0 2h8l-1.8 2.4a1 1 0 0 0 .2 1.4 1 1 0 0 0 .6.2 1 1 0 0 0 .8-.4l3-4a1 1 0 0 0 .02-1.18z" />
        </g>
      </g>
    </svg>
  );
};

export default Logout;
