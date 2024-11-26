import React from "react";

import Jumbotron from "./Main/Jumbotron";
import GoldJobs from "./Main/GoldJobs";
import PlatinumJobs from "./Main/PlatinumJobs";

function Main() {
  return (
    <>
      <Jumbotron />
      <div className="grid grid-cols-1 gap-y-4">
        <PlatinumJobs />
        <GoldJobs />
      </div>
    </>
  );
}

export default Main;
