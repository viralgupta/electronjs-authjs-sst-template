import Header from "@/components/header/Header"
import { toast } from "sonner"

function App() {
  return (
    <div className=''>
      <Header/>
    </div>
  )
}

window.ipcRenderer.on("Error", (_ev, args) => {
  toast.error(args)
})

export default App