import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SeatingChart from "./components/pages/SeatingChart";
import Welcome from "./components/pages/Welcome";
import DisplaySeatTables from "./components/pages/DisplaySeatTables";
import LinkInfo from "./components/pages/LinkInfo";
import 'react-tooltip/dist/react-tooltip.css'

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
              <>
                <LinkInfo/>
                <DisplaySeatTables
                />
              </>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
