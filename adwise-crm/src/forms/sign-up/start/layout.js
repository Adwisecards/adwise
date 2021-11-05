export default [
  {
    type: "row",
    items: [
      {
        type: "col",
        sm: 24,
        lg: 12,
        items: [
          { type: "field", name: "firstName" },
          { type: "field", name: "phone" },
          { type: "field", name: "password" },
        ],
      },
      {
        type: "col",
        sm: 24,
        lg: 12,
        items: [
          { type: "field", name: "lastName" },
          { type: "field", name: "email" },
          { type: "field", name: "confirmPassword" },
        ],
      },
    ],
  },
  {
    type: "row",
    items: [
      {
        type: "col",
        span: 24,
        items: [
          { type: "field", name: "country" },
          { type: "field", name: "privacyPolicy" },
        ],
      },
      {
        type: "col",
        span: 24,
        items: [{ type: "field", name: "offerAgreement" }],
      },
    ],
  },
];
