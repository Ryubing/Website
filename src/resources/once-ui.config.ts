import {
  DataStyleConfig,
  DisplayConfig,
  EffectsConfig,
  FontsConfig,
  ProtectedRoutesConfig,
  RoutesConfig,
  SameAsConfig,
  SchemaConfig,
  StyleConfig
} from "@/types";
import localFont from "next/font/local";

// IMPORTANT: used for SEO in meta tags and schema
const baseURL: string = "https://ryujinx.app";

const routes: RoutesConfig = {
  "/": true,
  "/download": true,
  "/donate": true,
  "/r": true
};

const display: DisplayConfig = {
  location: false,
  time: true,
  themeSwitcher: true,
};

// Enable password protection on selected routes
// Set password in the .env file, refer to .env.example
const protectedRoutes: ProtectedRoutesConfig = {};

const heading = localFont({
  src: "./Geist.woff2",
  display: "swap",
  variable: "--font-heading",
});

const body = localFont({
  src: "./Geist.woff2",
  display: "swap",
  variable: "--font-body",
});

const label = localFont({
  src: "./Geist.woff2",
  display: "swap",
  variable: "--font-label",
});

const code = localFont({
  src: "./Geist.woff2",
  display: "swap",
  variable: "--font-code",
});

const fonts: FontsConfig = {
  heading,
  body,
  label,
  code,
};

// default customization applied to the HTML in the main layout.tsx
const style: StyleConfig = {
  theme: "system", // dark | light | system
  neutral: "slate", // sand | gray | slate | mint | rose | dusk | custom
  brand: "custom", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan | custom
  accent: "custom", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan | custom
  solid: "inverse", // color | contrast
  solidStyle: "plastic", // flat | plastic
  border: "rounded", // rounded | playful | conservative | sharp
  surface: "translucent", // filled | translucent
  transition: "all", // all | micro | macro
  scaling: "100", // 90 | 95 | 100 | 105 | 110
};

const dataStyle: DataStyleConfig = {
  variant: "gradient", // flat | gradient | outline
  mode: "categorical", // categorical | divergent | sequential
  height: 24, // default chart height
  axis: {
    stroke: "var(--neutral-alpha-weak)",
  },
  tick: {
    fill: "var(--neutral-on-background-weak)",
    fontSize: 11,
    line: false,
  },
};

const effects: EffectsConfig = {
  mask: {
    cursor: true,
    x: 0,
    y: 0,
    radius: 50,
  },
  gradient: {
    display: true,
    opacity: 100,
    x: 50,
    y: 60,
    width: 60,
    height: 60,
    tilt: 0,
    colorStart: "accent-background-strong",
    colorEnd: "brand-background-strong",
  },
  dots: {
    display: false,
    opacity: 1,
    size: "2",
    color: "brand-background-strong",
  },
  grid: {
    display: false,
    opacity: 45,
    color: "accent-background-medium",
    width: "0.5rem",
    height: "0.5rem",
  },
  lines: {
    display: false,
    opacity: 100,
    color: "accent-background-medium",
    size: "16",
    thickness: 1,
    angle: 0,
  },
};



export {
  display,
  routes,
  protectedRoutes,
  baseURL,
  fonts,
  style,
  effects,
  dataStyle,
};
