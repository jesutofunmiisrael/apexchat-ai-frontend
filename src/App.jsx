

import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Header from "./Component/Header";
import Home from "./Component/Home";
import Signup from "./Component/Signup";
import SignupWorkspace from "./Component/Signupworkspace";
import SignupAI from "./Component/SignupAI";
import Dashboard from "./Component/Dashboard";
import UnderConstruction from "./Component/UnderConstruction";
import Widget from "./Component/Widget";
import Login from "./Component/Login";




function App() {
  return (
    <>
      <Toaster
        richColors
        position="top-right"
        closeButton
        visibleToasts={3}
      />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home />
            </>
          }


          
        />



         <Route
          path="/signup"
          element={<Signup />}
        />

        <Route path="/signup/workspace" element={<SignupWorkspace />} />


 <Route path="/signup/ai" element={<SignupAI />} />
 <Route path="/dashboard" element={<Dashboard />} />

<Route
  path="/under-construction"
  element={<UnderConstruction />}
/>


<Route
  path="/dashboard/widget"
  element={<Widget />}
/>


<Route
  path="/login"
  element={<Login />}
/>
      </Routes>

   
    </>
  );
}

export default App;
