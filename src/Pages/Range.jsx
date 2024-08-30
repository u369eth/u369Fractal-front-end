import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/system";
import { useTheme } from "@mui/material/styles";

const StyledSlider = styled(Slider)(({ theme }) => ({
  '& .MuiSlider-mark[data-index="1"], .MuiSlider-mark[data-index="2"], .MuiSlider-mark[data-index="3"], .MuiSlider-mark[data-index="4"]':
    {
      backgroundColor: "#0d6efd",
      width: 5,
      height: 5,
      marginTop: 0,
    },
  "& .MuiSlider-rail": {
    backgroundColor: theme.palette.primary.light,
  },
  "& .MuiSlider-track": {
    backgroundColor: theme.palette.primary.main,
  },
  "& .MuiSlider-thumb": {
    color: "#0d6efd",
  },
  '& .MuiSlider-mark[data-index="0"]': {
    display: "none",
  },
  color: "#0d6efd", // Change the color to blue
  "& .MuiSlider-valueLabel": {
    backgroundColor: "#0d6efd", // Change the value label background color to blue
    color: "#FFFFFF", // Change the value label text color to white
    borderRadius: 4,
    "& *": {
      background: "transparent",
      color: "inherit",
    },
  },
}));

export default function Range({ percentValue, barAmount, isDisable }) {
  const theme = useTheme();

  const marks = [
    {
      value: 0,
    },
    {
      value: 25,
    },
    {
      value: 50,
    },
    {
      value: 75,
    },
    {
      value: 100,
    },
  ];

  return (
    <Box sx={{ width: 350, ml: 1 }}>
      <StyledSlider
        theme={theme}
        value={percentValue}
        onChange={(e) => {
          barAmount(e.target.value);
        }}
        disabled={!isDisable}
        aria-label="Always visible"
        defaultValue={0}
        step={1}
        marks={marks}
        valueLabelFormat={(value) => `${value}%`}
      />
    </Box>
  );
}
