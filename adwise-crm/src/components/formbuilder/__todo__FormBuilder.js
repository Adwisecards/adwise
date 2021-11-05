import React from "react";
import TextBoxArray from "../ui/TextBoxArray/TextBoxArray";
import { Formik, Form as FormikForm, Field, useFormik } from "formik";
import {
  Row,
  Col,
  Typography,
  Button,
  Form,
  Input,
  Select,
  Checkbox,
  Switch,
} from "antd";
import "antd/dist/antd.css";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

export const fields = {
  textbox: {
    name: "textbox",
    render: () => <Input />,
  },
  textarea: {
    name: "textarea",
    render: (field) => <TextArea rows={field.lines} name={field.name} />,
  },
  ["textbox-array"]: {
    name: "textbox-array",
    render: (field, value) => <TextBoxArray field={field} values={value} />,
  },
  select: {
    name: "select",
    render: (field) => (
      <Select defaultValue={field.options[0].value} style={{ width: "100%" }}>
        {field.options &&
          field.options.map((f) => <Option value={f.value}>{f.label}</Option>)}
      </Select>
    ),
  },
  toggle: {
    name: "toggle",
    label: "inline",
    render: (field) => <Switch defaultChecked />,
  },
  checkbox: {
    name: "checkbox",
    label: "none",
    render: (field) => <Checkbox>{field.label}</Checkbox>,
  },
};

const _renderFormItem = (fieldData, child) => (
  <Form.Item
    help={fieldData.description}
    colon={false}
    label={fieldData.label}
    labelCol={{ span: 24 }}
  >
    {child}
  </Form.Item>
);

const _renderField = (fieldData) => {
  const field = fields.find((el) => el.name == fieldData.name);
  return (
    <Field
      name={fieldData.name}
      render={({ field }) => _renderFormItem(fieldData, field)}
    />
  );
};

const _renderFieldsToObject = (fields) => {
  let fieldRenders = {};
  const fieldName = fields.map((el) => el.name);

  if (fields && fieldName.length > 0) {
    fieldName.forEach((fieldName) => {
      const field = fields.find((el) => el.name === fieldName);
      fieldRenders[fieldName] = _renderField(field);
    });
  }
  return fieldRenders;
};

const _renderLayout = (fieldRenders, layout) => {
  return (
    <Row gutter={[64, 16]}>
      {layout &&
        layout.map((col) => (
          <Col span={col.span}>
            {col.items &&
              col.items.map((i) => {
                if (i.type === "field") return fieldRenders[i.name];
                else if (i.type === "description")
                  return (
                    <Text style={i.styles} type="secondary">
                      {i.value}
                    </Text>
                  );
              })}
          </Col>
        ))}
    </Row>
  );
};

export default (props) => {
  const fields = props.fields;
  const layout = props.layout;
  return (
    <Formik
      initialValues={props.initValues}
      onSubmit={async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {(props) => {
        const fieldsData = fields(props.values);
        return (
          <FormikForm>
            <Form>
              {_renderLayout(_renderFieldsToObject(fieldsData), layout)}
              <Button type="primary">Сохранить</Button>
            </Form>
          </FormikForm>
        );
      }}
    </Formik>
  );
};
