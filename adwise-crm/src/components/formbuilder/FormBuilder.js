import React from "react";
import {
  Input,
  TextArea,
  Checkbox,
  Switch,
  MaskedInput,
  TextBoxArray,
} from "../ui/UI";
import { Formik, Form as FormikForm, Field, useFormik } from "formik";
import {
  Row,
  Col,
  Typography,
  Button,
  Form,
  Space,
  Select,
  // Checkbox,
  // Switch,
  Upload,
} from "antd";
// import MaskedInput from "antd-mask-input";

import { UploadOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

// const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

export const FIELD_TYPES = {
  TEXTAREA: "textarea",
  TEXTBOX: "textbox",
  MASKED_TEXTBOX: "masked-textbox",
  SELECT: "select",
  TOGGLE: "toggle",
  CHECKBOX: "checkbox",
  TEXTBOX_ARRAY: "textbox-array",
  SHEDULE: "shedule",
  UPLOAD: "upload",
};
const FT = FIELD_TYPES;

const _renderTextInput = (field, value) => {
  return (
    <Form.Item
      help={field.touched && field.error ? field.error : field.description}
      colon={false}
      label={field.label}
      labelCol={{ span: 24 }}
      style={{ marginBottom: 20 }}
      validateStatus={field.touched && field.error ? "error" : null}
    >
      <Input
        name={field.name}
        onBlur={field.handleBlur}
        onChange={field.handleChange}
        value={field.value}
      />
    </Form.Item>
  );
};

const _renderTextArea = (field, value) => {
  return (
    <Form.Item
      help={field.description}
      colon={false}
      label={field.label}
      labelCol={{ span: 24 }}
      style={{ marginBottom: 20 }}
    >
      <TextArea rows={field.lines} name={field.name} value={value} />
    </Form.Item>
  );
};

const _renderMaskedInput = (field, value) => {
  return (
    <Form.Item
      help={field.description}
      colon={false}
      label={field.label}
      labelCol={{ span: 24 }}
    >
      <MaskedInput
        name={field.name}
        value={value}
        mask="+1(111)111-11-11"
        size="4"
      />
    </Form.Item>
  );
};

const _renderTextBoxArray = (field, value) => {
  return (
    <Form.Item
      help={field.description}
      colon={false}
      label={field.label}
      labelCol={{ span: 24 }}
      style={{ marginBottom: 10 }}
    >
      <TextBoxArray field={field} values={value} />
    </Form.Item>
  );
};

const _renderSelect = (field, value) => {
  return (
    <Form.Item colon={false} label={field.label} labelCol={{ span: 24 }}>
      <Select
        defaultValue={
          field.options && field.options.length >= 1 && field.options[0].value
        }
        style={{ width: "100%" }}
      >
        {field.options &&
          field.options.map((f) => <Option value={f.value}>{f.label}</Option>)}
      </Select>
    </Form.Item>
  );
};

const _renderToggle = (field, value) => {
  return (
    <Form.Item colon={false} label={field.label}>
      <Switch defaultChecked />
    </Form.Item>
  );
};

const _renderCheckbox = (field, value) => {
  return <Checkbox>{field.label}</Checkbox>;
};

const _renderUpload = (field, value) => {
  return (
    <Upload
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      listType="picture"
      className="upload-list-inline"
    >
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  );
};

const _renderField = (field, value) => {
  if (!field.type) {
    return <></>;
  }
  switch (field.type) {
    case FT.TEXTBOX:
      return _renderTextInput(field, value);
    case FT.TEXTAREA:
      return _renderTextArea(field, value);
    case FT.MASKED_TEXTBOX:
      return _renderMaskedInput(field, value);
    case FT.TOGGLE:
      return _renderToggle(field, value);
    case FT.CHECKBOX:
      return _renderCheckbox(field, value);
    case FT.SELECT:
      return _renderSelect(field, value);
    case FT.TEXTBOX_ARRAY:
      return _renderTextBoxArray(field, value);
    case FT.UPLOAD:
      return _renderUpload(field, value);
    default:
      return <></>;
  }
};

const _renderFieldLayout = (fieldData) => {
  return (
    <Field
      name={fieldData.name}
      render={({ field }) => _renderField(fieldData)}
    />
  );
};

const _renderFieldsToObject = (fields) => {
  let fieldRenders = {};
  const fieldName = fields.map((el) => el.name);

  if (fields && fieldName.length > 0) {
    fieldName.forEach((fieldName) => {
      const field = fields.find((el) => el.name === fieldName);
      fieldRenders[fieldName] = _renderFieldLayout(field);
    });
  }
  return fieldRenders;
};

const _renderCol = (col, fieldRenders) => {
  const span = col.sm || col.lg || col.xl ? null : col.span;

  return (
    <Col span={col.span} sm={col.sm} lg={col.lg} xl={col.xl}>
      {col.items &&
        col.items.map((i) => {
          if (i.type === "field") return fieldRenders[i.name];
          else if (i.type === "description")
            return (
              <Space style={i.styles}>
                <Text style={i} type="secondary">
                  {i.value}
                </Text>
              </Space>
            );
        })}
    </Col>
  );
};

const _renderLayout = (fieldRenders, layout) => {
  return (
    <Row gutter={[64, 16]}>
      {layout &&
        layout.map((node) => {
          if (node.type === "row") {
            return (
              node.items &&
              node.items.map((col) => {
                return _renderCol(col, fieldRenders);
              })
            );
          } else if (node.type === "col") {
            return _renderCol(node, fieldRenders);
          }
        })}
    </Row>
  );
};

export default (props) => {
  const button = props.button;
  const fields = props.fields;
  const layout = props.layout;
  return (
    <Formik
      initialValues={props.initValues}
      onSubmit={async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        alert(JSON.stringify(values, null, 2));
      }}
      validationSchema={props.schema}
    >
      {(props) => {
        const fieldsData =
          typeof fields === "object" ? fields : fields(props.values);
        const fieldsWithProps = fieldsData.map((el) => ({
          ...el,
          value: props.values[el.name],
          handleBlur: props.handleBlur,
          handleChange: props.handleChange,
          error: props.errors[el.name],
          touched: props.touched[el.name],
        }));
        return (
          <FormikForm>
            <Form>
              {_renderLayout(_renderFieldsToObject(fieldsWithProps), layout)}
              {button ? button : <Button type="primary">Сохранить</Button>}
            </Form>
          </FormikForm>
        );
      }}
    </Formik>
  );
};
