import React from "react";
import fields from "./settings";
import schema from "./schema";
import layout from "./layout";
import FormBuilder from "../../../components/formbuilder/FormBuilder";
import { Button } from "../../../components/ui/UI";
import { NavLink } from "react-router-dom";

export default (props, context) => {
  const initValues = {
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  };
  return (
    <FormBuilder
      initValues={initValues}
      fields={fields}
      schema={schema}
      layout={layout}
      button={
        <NavLink to="/registration-company">
          <Button type="primary">Продолжить регистрацию</Button>
        </NavLink>
      }
    />
  );
};
