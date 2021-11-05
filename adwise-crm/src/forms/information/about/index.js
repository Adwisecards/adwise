import React from "react";
import fields from "./settings";
import layout from "./layout";
import FormBuilder from "../../../components/formbuilder/FormBuilder";

export default (props) => {
  const initValues = {
    name: "123",
    annotation: "456",
    description: "789",
    phone: "",
    currency: "",
    category: "",
    tags: {
      tag: []
    },
    links: [["1", "2"]],
  };
  return <FormBuilder initValues={initValues} fields={fields} layout={layout} />;
};
