import React from "react";
import fields from "./settings";
import layout from "./layout";
import FormBuilder from "../../../components/formbuilder/FormBuilder";

export default (props) => {
  const initValues = { address: "" };
  return <FormBuilder initValues={initValues} fields={fields} layout={layout} />;
};
