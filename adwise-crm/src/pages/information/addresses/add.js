import React from "react";
import fields from "../../../forms/information/addresses/AddBranch";
import FormBuilder from "../../../components/formbuilder/FormBuilder";

export default (props) => {
  const initValues = {};
  return <FormBuilder initValues={initValues} fields={fields} />;
};
