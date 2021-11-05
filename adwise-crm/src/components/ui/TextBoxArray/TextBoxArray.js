import React, { Component } from "react";
import { Form, Space, Button } from "antd";
import { FIELD_TYPES as FT } from "../../formbuilder/FormBuilder";
import Icon, {
  MinusOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Input } from "../UI";

class TextBoxArray extends Component {
  _renderField(field) {
    return (
      <>
        <Form.Item
          {...field}
          name={field.name}
          fieldKey={field.fieldKey}
          rules={[{ required: true, message: "Missing first name" }]}
        >
          <Input placeholder={field.label} />
        </Form.Item>
      </>
    );
  }

  _renderFieldsArrayWithSpace(field, schema, add, remove, fieldsLength) {
    return (
      <Space
        key={field.key}
        style={{ display: "flex", marginBottom: 0 }}
        align="baseline"
      >
        {this._renderLayout(this._renderFieldsToArray(schema, remove))}
        <MinusOutlined onClick={() => remove(field.name)} />
        {/* {fieldsLength > 1 && (
          <MinusCircleOutlined onClick={() => remove(field.name)} />
        )}
        {fieldsLength === 1 && <MinusCircleOutlined style={{ opacity: 0.5 }} />} */}
      </Space>
    );
  }

  _renderFieldsToArray(schema, remove) {
    const keys = Object.keys(schema);
    let fields = [];

    if (schema && keys.length > 0) {
      keys.forEach((schemaItemName) => {
        const field = schema[schemaItemName];
        const fieldRender = this._renderField(field, remove);
        fields.push(fieldRender);
      });
    }

    return fields;
  }

  _renderLayout(fieldsArray) {
    return fieldsArray[0];
  }

  render() {
    const { field } = this.props;
    const { name, schema } = this.props.field;

    return (
      <Form.List name={name}>
        {(fields, { add, remove }) => {
          return (
            <>
              <Space
                style={{ display: "flex", marginBottom: 0 }}
                align="baseline"
              >
                <Form.Item>
                  <Input />
                </Form.Item>
                <Icon
                  className="btn-plus"
                  component={PlusOutlined}
                  onClick={() => add()}
                />
                {/* <PlusOutlined onClick={() => add()} /> */}
              </Space>

              {fields.map((field, index) =>
                this._renderFieldsArrayWithSpace(
                  { ...field, index },
                  schema,
                  add,
                  remove,
                  fields.length
                )
              )}
            </>
          );
        }}
      </Form.List>
    );

    // const { values } = this.props;
    // return <>{values && values.map((v) => this._renderItem(v))}</>;
  }
}

export default TextBoxArray;
