import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <FileUpload onFileSelect={() => {}} disabled={false} />

      <Button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </Button>
    </>
  );
}

export default App;
