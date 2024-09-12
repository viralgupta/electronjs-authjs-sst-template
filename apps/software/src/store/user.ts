import { atom, selector } from "recoil";
import { useSession, getSession } from "next-auth/react"

const userAtomState = atom({
  key: 'userAtomState',
  default: selector({
    key: 'userAtomStateSelector',
    get: () => {
      const session = useSession();
      
      if(!session.data?.user) return null;
      return {
        // @ts-ignore
        id: session?.data?.user?.id,
        name: session?.data?.user?.name,
        // @ts-ignore
        image: session?.data?.user?.isAdmin 
      }
    }
  }),
  effects: [
    ({ setSelf }) => {
      window.ipcRenderer.on("Session", () => {
        console.log("Session updated in electron");
        getSession().then((session) => {
          console.log("session", session);
          if(!session?.user) return null;
          setSelf({
            // @ts-ignore
            id: session?.user?.id,
            name: session?.user?.name,
            // @ts-ignore
            image: session?.user?.isAdmin 
          });
        })
      })
    }
  ]
});


export {
  userAtomState
}