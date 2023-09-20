const constants = {
  BASE_URL: "http://localhost:3001/api/v1/",
  DEBOUNCE_DELAY: 300,
  DUMMY_AVATAR_URL:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fFBFUlNPTnxlbnwwfDF8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
};

export const APIS = {
  GROUP: "group",
  TASK: "task",
  GET_FORMNAMES: "task/getFormNames",
  LOGIN: "user/login",
  USER_DETAILS: "user/getUserDetails",
  MEMBERS: "members",
};
export const COLORS = { PRIMARY: "#0045f6" };

export const THEME_VALUES = {
  PALETTE_PRIMARY_MAIN: { light: COLORS["PRIMARY"], dark: COLORS["PRIMARY"] },
  PALETTE_SECONDARY_MAIN: { light: "#ffa500", dark: "#e4e4ec" },
  PALETTE_BACKGROUND_DEFAULT: { light: "#EDF2F8", dark: "#1A1A1A" },
  PALETTE_PAPER_DEFAULT: { light: "#FFF", dark: "#282828" },
  CARD_BOXSHADOW: {
    light: "0px 1px 8px rgb(23 110 222 / 10%)",
    dark: "0 2px 20px rgba(0, 0, 0, 0.87)",
  },
  TEXT_COLOR_PRIMARY: { light: "#1E1E1E", dark: "white" },
  TEXT_COLOR_SECONDARY: { light: "#7A7A7A", dark: "white" },
};
export const TASKTYPECOLORS = {
  bug: "red",
  changes: "orange",
  enhancement: "green",
  testing: "purple",
  deployment: "teal",
  code_optimization: "gold",
};

export const TASKTYPES = [
  { id: "bug", label: "Bug" },
  { id: "changes", label: "Changes" },
  { id: "enhancement", label: "Enhancement" },
  { id: "testing", label: "Testing" },
  { id: "deployment", label: "Deployment" },
  { id: "code_optimization", label: "Code Optimization" },
];

export const getRandomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`;

export const DARKCOLORS = {
  a: '#303F9F', // Dark blue
  b: '#512DA8', // Dark purple
  c: '#00796B', // Dark red
  d: '#D32F2F', // Dark blue
  e: '#512DA8', // Dark purple
  f: '#E64A19', // Dark orange
  g: '#8E24AA', // Dark purple
  h: '#FF6F00', // Dark orange
  i: '#AFB42B', // Dark yellow
  j: '#FFD600', // Dark yellow
  k: '#1976D2', // Dark teal
  l: '#388E3C', // Dark green
  m: '#FFA000', // Dark orange
  n: '#F57C00', // Dark orange
  o: '#FF7043', // Dark orange
  p: '#607D8B', // Dark gray
  q: '#795548', // Dark brown
  r: '#C2185B', // Dark pink
  s: '#689F38', // Dark green
  t: '#8BC34A', // Dark green
  u: '#3949AB', // Dark blue
  v: '#FF5252', // Dark red
  w: '#546E7A', // Dark gray
  x: '#C51162', // Dark pink
  y: '#009688', // Dark teal
  z: '#0288D1', // Dark blue
};

export const { BASE_URL, DEBOUNCE_DELAY, DUMMY_AVATAR_URL } = constants;
