import { deepFreeze } from "grommet/utils";
import { css } from "styled-components";

export default deepFreeze({
  global: {
    colors: {
      brand: "#01a982",
      border: {
        light: "rgba(168, 171, 184, 0.3)",
      },
      focus: undefined,
      // "accent-1": "#2AD2C9",
      "accent-2": "#614767",
      "accent-3": "#ff8d6d",
      "neutral-1": "#425563",
      "neutral-2": "#5F7A76",
      "neutral-3": "#80746E",
      "neutral-4": "#767676",
      "status-critical": "#F04953",
      "status-error": "#F04953",
      "status-warning": "#FFD144",
      "status-ok": "#01a982",
    },
  },
  anchor: {
    textDecoration: "underline",
    color: {
      dark: "#FFFFFF",
      light: "#000000",
    },
  },
  button: {
    border: {
      radius: "0px",
    },
  },
  clock: {
    analog: {
      second: {
        color: {
          dark: "#01a982",
          light: "#01a982",
        },
      },
    },
  },
  tab: {
    active: {
      color: "#fff",
    },
    hover: {
      color: "#fff",
    },
    border: undefined,
    color: "#fff",
    font: {
      weight: 500,
    },
    margin: 0,
    pad: 0,
  },
});
