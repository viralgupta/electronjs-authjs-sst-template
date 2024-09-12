import { ThemeToggle } from "./ThemeToggle"
import User from "./User"

const Header = () => {
  return (
    <div className="h-20 p-2 flex justify-between items-center border-b">
      <div className="flex items-center font-cubano sm:text-3xl text-foreground">
        <img src="ctc.svg" alt="logo" className="h-16 mr-4" /> 
        Chintpurni Plywoods
      </div>
      <div className="flex items-center">
        {/* <Emergency/> */}
        <ThemeToggle/>
        <User/>
      </div>
    </div>
  )
}

export default Header