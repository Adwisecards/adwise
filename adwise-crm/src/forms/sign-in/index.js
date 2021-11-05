import React from "react";
import fields from "./settings";
import schema from "./schema";
import layout from "./layout";
import FormBuilder from "../../components/formbuilder/FormBuilder";
import { Button } from "../../components/ui/UI";
import { NavLink } from "react-router-dom";

export default (props, context) => {
  const initValues = {
    login: "",
    password: "",
  };
  return (
    <FormBuilder
      initValues={initValues}
      fields={fields}
      schema={schema}
      layout={layout}
      button={
        <Button type="primary" style={{ marginTop: 0, marginBottom: 20 }}>
          Войти
        </Button>
      }
    />
  );
};
