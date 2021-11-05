import styled, { css } from "styled-components";
import u from "./utils";
import v from "./variables";
import {
  Button as AButton,
  Input as AInput,
  Checkbox as ACheckbox,
  Switch as ASwitch,
} from "antd";
import AMaskedInput from "antd-mask-input";
import TextBoxArray from "./TextBoxArray/TextBoxArray";

export const Button = styled(AButton)`
  &.ant-btn {
    border-color: unset;
    border-radius: 6px;
    font-size: 18px;
    height: unset;
    padding: 5px 20px;
    &.ant-btn-primary {
      background-color: #8152e4;
    }
  }
`;

export const Switch = styled(ASwitch)`
  &.ant-switch.ant-switch-checked {
    background-color: #8152e4;
    &:focus {
      box-shadow: 0 0 0 2px #8152e499;
    }
  }
`;

export const Checkbox = styled(ACheckbox)`
  &.ant-checkbox-wrapper {
    > .ant-checkbox {
      > .ant-checkbox-input:hover + .ant-checkbox-inner {
        border-color: #8152e499;
      }
      > .ant-checkbox-input:focus + .ant-checkbox-inner {
        border-color: #8152e4;
      }
      &.ant-checkbox-checked {
        > .ant-checkbox-inner {
          background-color: #8152e4;
          border-color: #8152e4;
        }
        &:after {
          border: 1px solid #8152e4;
        }
      }
    }

    // > .ant-checkbox.ant-checkbox-checked {
    //   > .ant-checkbox-inner {
    //     background-color: #8152e4;
    //     border-color: #8152e4;
    //   }
    // }
  }
`;

const inputStyles = `
&.ant-input {
  background: #fff;
  border-width: rgba(168, 171, 184, 0.3);
  border-radius: 5px;
  font-size: 16px;
  padding: 7px 15px;
  &:hover {
    border-color: #8152e499;
  }
  &:focus {
    border-color: #8152e4;
    box-shadow: 0 0 0 2px #8152e455;
  }
}
`;

export const TextArea = styled(AInput.TextArea)`
  ${inputStyles}
`;

export const Input = styled(AInput)`
  ${inputStyles}
`;

export const MaskedInput = styled(AMaskedInput)`
  ${inputStyles}
`;

export { TextBoxArray };
