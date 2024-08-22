import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SeatingChart from "./components/pages/SeatingChart";
import Welcome from "./components/pages/Welcome";
import DisplaySeatTables from "./components/pages/DisplaySeatTables";
import 'react-tooltip/dist/react-tooltip.css'
import { SiLinkedin, SiGithub } from "react-icons/si";


const App: React.FC = () => {

  return (
    <BrowserRouter>
      <h1 id="title">Planning Seats</h1>
      <hr className="underline" />
      <main>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/seatplanning/:id" element={<SeatingChart />} />
          <Route
            path="/:id"
            element={
                <DisplaySeatTables/>
            }
          />
        </Routes>
      </main>
      <div id="footer"><h5>Courtesy of Alysia Geiger</h5><a className="link" href="https://www.linkedin.com/in/alysiageiger/" target="blank"><SiLinkedin /></a> <a className="link" href="https://github.com/Kawaikimono" target="blank"><SiGithub/></a></div>
    </BrowserRouter>
  );
};

export default App;
