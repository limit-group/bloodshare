import { Step, StepLabel, Stepper } from "@mui/material";

import React from "react";

export default function Wizard({ activeStep = 0 }) {
  return (
    <Stepper
      className={{ fontFamily: "Ruda" }}
      activeStep={activeStep}
      alternativeLabel
    >
      {["Create Account", "Verify Facility", "Facility Info"].map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
