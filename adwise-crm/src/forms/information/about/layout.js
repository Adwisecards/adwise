import { fields } from "./settings";
const f = fields;

export default [
  {
    type: "col",
    span: 8,
    items: [
      { type: "field", name: "name" },
      { type: "field", name: "annotation" },
      { type: "field", name: "description" },
      { type: "field", name: "phone" },
      { type: "field", name: "currency" },
      { type: "field", name: "category" },
      { type: "field", name: "tags" },
    ],
  },
  {
    type: "col",
    span: 8,
    items: [
      { type: "field", name: "mainButton" },
      {
        type: "description",
        styles: { marginBottom: 48 },
        value:
          "Здесь вы можете добавить собственную кнопку(не более 20 символов) на вашей страницев приложении AdWise",
      },
      { type: "field", name: "mainButtonName" },
      { type: "field", name: "mainButtonLink" },
      { type: "field", name: "mainButtonLink" },
    ],
  },
];
