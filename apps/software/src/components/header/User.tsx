import LoginDialog from "./LoginDialog";
import { useRecoilValue } from "recoil";
import { userAtomState } from "@/store/user";

const User = () => {
  const user = useRecoilValue(userAtomState);
  console.log("user", user);
  return (
    <LoginDialog disabled={!user ? false : true}>
        <div className="flex p-2 items-center mx-4 border border-border rounded-md">
          <UserIcon/>
          &nbsp;{!user ? "Login" : user.name}
        </div>
    </LoginDialog>
  );
}

const UserIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      id="user"
    >
      <path
        className="fill-primary"
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm3-12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-9 7a7.489 7.489 0 0 1 6-3 7.489 7.489 0 0 1 6 3 7.489 7.489 0 0 1-6 3 7.489 7.489 0 0 1-6-3Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default User;