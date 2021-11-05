export default {
  nav: [
    {
      title: "Создать",
      items: [
        {
          title: "Карточка компании",
          route: "/stock/create",
          createLink: true,
        },
        {
          title: "Визитка сотрудника",
          createLink: { action: "CREATE_EMPLOYEE_CARD" },
        },
        {
          title: "Акция сотрудника",
          createLink: { action: "CREATE_EMPLOYEE_STOCK" },
        },
        {
          title: "Акция для группы сотрудников",
          createLink: { action: "CREATE_EMPLOYEE_GROUP_STOCK" },
        },
      ],
    },
    {
      title: "Моя компания",
      items: [
        { title: "Информация", route: "/information" },
        { title: "Сотрудники", route: "/employees" },
      ],
    },
    {
      title: "Управление",
      items: [
        { title: "Клиенты" },
        { title: "Реферальная программа " },
        { title: "Кассовый APP" },
        { title: "Операции" },
        { title: "Финансы" },
      ],
    },
  ],
  footerLinks: [
    { title: "Материалы", route: "/materials" },
    { title: "Документы", route: "/documents" },
  ],
};
