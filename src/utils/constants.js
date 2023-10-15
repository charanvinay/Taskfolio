import Login from "../../src/Assets/login.png";
import BoyWithTasks from "../../src/Assets/boywithtasks.png";
import BoyWithPhone from "../../src/Assets/boyphone.png";
import GroupTasks from "../../src/Assets/grouptasks.png";
import ManWithPhone from "../../src/Assets/manwithphone.png";
const constants = {
  BASE_URL: process.env.REACT_APP_BACKEND_URL,
  DEBOUNCE_DELAY: 300,
  DUMMY_AVATAR_URL:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fFBFUlNPTnxlbnwwfDF8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
};

export const APIS = {
  GROUP: "group",
  TASK: "task",
  GET_FORMNAMES: "task/getFormNames",
  LOGIN: "user/login",
  REGISTER: "user/register",
  FORGOT_PASSWORD: "user/forgotPassword",
  RESET_PASSWORD: "user/resetPassword",
  USER: "user",
  MEMBERS: "members",
};
export const COLORS = { PRIMARY: "#0045f6", BG: "#EDF2F8" };

export const THEME_VALUES = {
  PALETTE_PRIMARY_MAIN: { light: COLORS["PRIMARY"], dark: COLORS["PRIMARY"] },
  PALETTE_SECONDARY_MAIN: { light: "#ffa500", dark: "#e4e4ec" },
  PALETTE_BACKGROUND_DEFAULT: { light: COLORS["BG"], dark: "#1A1A1A" },
  PALETTE_PAPER_DEFAULT: { light: "#FFF", dark: "#282828" },
  CARD_BOXSHADOW: {
    light: "0px 1px 8px rgb(23 110 222 / 10%)",
    dark: "0 2px 20px rgba(0, 0, 0, 0.87)",
  },
  TEXT_COLOR_PRIMARY: { light: "#1E1E1E", dark: "white" },
  TEXT_COLOR_SECONDARY: { light: "#7A7A7A", dark: "white" },
};

export const TASKTYPES = [
  { id: "bug", label: "Bug", color: "red" },
  { id: "changes", label: "Changes", color: COLORS["PRIMARY"] },
  { id: "enhancement", label: "Enhancement", color: "green" },
  { id: "testing", label: "Testing", color: "purple" },
  { id: "deployment", label: "Deployment", color: "teal" },
  { id: "code_optimization", label: "Code Optimization", color: "#FF6F00" },
];

export const TASKTYPECOLORS = TASKTYPES.reduce((acc, curr) => {
  acc[curr.id] = curr.color;
  return acc;
}, {});

export const TASK_STATUSES = [
  { id: "not_started", label: "Not Started", color: "#607D8B" },
  { id: "wip", label: "Work in progress", color: "#FF6F00" },
  { id: "completed", label: "Completed", color: "green" },
  { id: "need_clarity", label: "Need clarity", color: "red" },
  { id: "hold", label: "On Hold", color: "black" },
];

export const TASK_STATUS_COLORS = TASK_STATUSES.reduce((acc, curr) => {
  acc[curr.id] = curr.color;
  return acc;
}, {});

export const getRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`;

export const DARKCOLORS = {
  a: "#303F9F", // Dark blue
  b: "#512DA8", // Dark purple
  c: "#00796B", // Dark red
  d: "#D32F2F", // Dark blue
  e: "#512DA8", // Dark purple
  f: "#E64A19", // Dark orange
  g: "#8E24AA", // Dark purple
  h: "#FF6F00", // Dark orange
  i: "#AFB42B", // Dark yellow
  j: "#FFD600", // Dark yellow
  k: "#1976D2", // Dark teal
  l: "#388E3C", // Dark green
  m: "#FFA000", // Dark orange
  n: "#F57C00", // Dark orange
  o: "#FF7043", // Dark orange
  p: "#607D8B", // Dark gray
  q: "#795548", // Dark brown
  r: "#C2185B", // Dark pink
  s: "#689F38", // Dark green
  t: "#8BC34A", // Dark green
  u: "#3949AB", // Dark blue
  v: "#FF5252", // Dark red
  w: "#546E7A", // Dark gray
  x: "#C51162", // Dark pink
  y: "#009688", // Dark teal
  z: "#0288D1", // Dark blue
};

export const getTaskFormSchema = () => {
  return [
    {
      id: 1,
      name: "groupId",
      label: "Group",
      element: "dropdown",
      freeSolo: false,
      value: null,
      placeholder: "Select a group",
    },
    {
      id: 6,
      name: "assignedTo",
      label: "Assign To",
      element: "dropdown",
      freeSolo: false,
      value: null,
      placeholder: "Select a member",
      options: [],
    },
    {
      id: 2,
      name: "formName",
      label: "Form/Module/Page name",
      element: "dropdown",
      freeSolo: true,
      value: null,
      placeholder: "Eg: Doctor Assessment",
      options: [],
    },
    {
      id: 3,
      name: "type",
      label: "Type",
      element: "radio",
      value: TASKTYPES[0]["id"],
      options: TASKTYPES,
      colors: TASKTYPECOLORS,
    },
    {
      id: 5,
      name: "status",
      label: "Status",
      element: "radio",
      value: TASK_STATUSES[0]["id"],
      options: TASK_STATUSES,
      colors: TASK_STATUS_COLORS,
    },
    {
      id: 4,
      name: "title",
      label: "What have you done?",
      element: "input",
      value: null,
      multiline: true,
      placeholder: "Eg: [BUG 1148] Developed a user interface for billing form...",
    },
  ];
};

export const CAROUSEL_ITEMS = [
  {
    id: 1,
    alt: "Boy with laptop",
    text: "Login with you credentials and track your tasks more effectively",
    imageUrl: Login,
  },
  {
    id: 2,
    alt: "Boy with laptop in his hand showing tasks",
    text: "Track Task Progress and Achievements",
    imageUrl: BoyWithTasks,
  },
  {
    id: 3,
    alt: "Boy with phone",
    text: "Manage tasks anywhere, anytime with responsive design",
    imageUrl: BoyWithPhone,
  },
  {
    id: 4,
    alt: "Girl with phone",
    text: "Collaborative Task Sharing for Teamwork",
    imageUrl: GroupTasks,
  },
  {
    id: 5,
    alt: "Man with phone",
    text: "Able to copy all the completed tasks and paste in emails ",
    imageUrl: ManWithPhone,
  },
];

export const COPY_STYLES =[
  {id: 1, name: "none", label: "Plain text"},
  {id: 2, name: "dot", label:"List items"},
  {id: 3, name: "type", label: "Task type only"},
  {id: 4, name: "dot-type", label: "List item with Task type"},
]
export const { BASE_URL, DEBOUNCE_DELAY, DUMMY_AVATAR_URL } = constants;
