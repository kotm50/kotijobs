import React from "react";

import Jumbotron from "./Main/Jumbotron";
import PremiumJobs from "./Main/PremiumJobs";
import GoldJobs from "./Main/GoldJobs";

function Main() {
  return (
    <>
      <Jumbotron />
      <div className="grid grid-cols-1 gap-y-4">
        <PremiumJobs />
        <GoldJobs />
      </div>
    </>
  );
}

export default Main;
