import Dashboard from "./Components/Dashboard/Dashboard";
import Form from "./Components/Form/Form";
import { Route,Routes,BrowserRouter } from "react-router-dom";
import Preloader from "./Preloader/Preloader";
import { useEffect, useState } from "react";

function App() {

  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    setLoading(true)
    setTimeout(()=>{
      setLoading(false)
    },2500)
  },[])

  return (
    loading ? 
    (<Preloader></Preloader>)
    : (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Form></Form>}></Route>
            <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    )
  );
}

export default App;
