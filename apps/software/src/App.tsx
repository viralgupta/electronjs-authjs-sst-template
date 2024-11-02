import ProtectedBody from "./Body";
import User from "./components/User";

function App() {
  return (
    <div className="w-full h-full">
      <ProtectedBody>
        <User />
      </ProtectedBody>
    </div>
  );
}

export default App;
