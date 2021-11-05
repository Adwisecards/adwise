import iconsAtlas from "../settings/icons.atlas";
const icons = iconsAtlas.topnav;

export default [
  { icon: icons.bonus, route: "/bonus" },
  { icon: icons.notifiction, route: "/notifications" },
  { icon: icons.profile, title: "Личный кабинет", route: "profile" },
  { icon: icons.flagRu, title: "Русский", action: "setLanguage" },
  { icon: icons.logout, title: "Выход", action: "logout" },
];
