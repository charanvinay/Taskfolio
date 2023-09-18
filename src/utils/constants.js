const constants = {
  BASE_URL: "http://localhost:3001/api/v1/",
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

export const { BASE_URL, DUMMY_AVATAR_URL } = constants;
