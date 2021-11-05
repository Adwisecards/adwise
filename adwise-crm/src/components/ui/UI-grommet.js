import styled, { css } from "styled-components";
import {
  Heading as GHeading,
  Card as GCard,
  Tabs as GTabs,
  Tab as GTab,
  FormField as GFormField,
  TextInput as GTextInput,
  Select as GSelect,
  MaskedInput as GMaskedInput,
  CheckBox as GCheckBox,
  TextArea as GTextArea,
} from "grommet";
import u from "./utils";
import v from "./variables";

import TextBoxArray from "./TextBoxArray/TextBoxArray";

export const Card = styled(GCard)`
  border: 1px solid rgba(168, 171, 184, 0.3);
  border-radius: 5px;
  box-shadow: none;
`;

export const Heading = styled(GHeading)`
  font-size: ${(props) => (props.level === 3 ? "20px" : null)};
  font-weight: 400;
`;

export const FormField = styled(GFormField)`
  > div {
    border-bottom: 0;
  }
`;

export const TextArea = styled(GTextArea)``;

export const MaskedInput = styled(GMaskedInput)``;

export const CheckBox = styled(GCheckBox)``;

export const Select = styled(GSelect)``;

export const TextInput = styled(GTextInput)`
  //border: 1px solid rgba(168, 171, 184, 0.3);
  border-radius: 5px;
`;

export const Tab = styled(GTab)`
  background: #c4a2fc;
  padding: 5px;

  > div > span {
    ${(props) => css`
      background: ${props.active ? "#fff" : "transparent"};
      color: ${props.active ? "#222" : "#fff"};
      font-size: 18px;
      font-weight: 500;
    `}
    border-radius: ${v.tab.borderRadius}px;
    padding: 5px 20px;
  }

  &:first-child {
    ${u.borderRadius(v.tabs.borderRadius, "left")}
  }
  &:last-child {
    ${u.borderRadius(v.tabs.borderRadius, "right")}
  }
`;

export { TextBoxArray };
