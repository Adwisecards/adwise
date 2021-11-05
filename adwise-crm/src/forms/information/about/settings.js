import {
  FIELD_TYPES as FT,
  // FIELD_MASKS as FM,
} from "../../../components/formbuilder/FormBuilder";

import currencies from "../../../settings/currencies";
import categories from "../../../settings/data/categories";

import lexems from "../../../settings/lexems";
const L = lexems.forms.information.about;

export const fields = {
  name: { type: FT.TEXTBOX },
  annotation: { type: FT.TEXTAREA, lines: 2 },
  description: { type: FT.TEXTAREA, counter: true, lines: 6 },
  phone: { type: FT.TEXTBOX, }, //mask: FM.PHONE },
  currency: {
    type: FT.SELECT,
    options: currencies.map((ccy) => ({
      value: ccy.code,
      label: `${ccy.symbol} — ${ccy.title}`,
    })),
  },
  category: { type: FT.SELECT, options: categories },
  tags: {
    type: FT.TEXTBOX_ARRAY, schema: {
      tag: { type: FT.TEXTBOX }
    }
  },
  mainButton: { type: FT.TOGGLE },
  mainButtonName: { type: FT.TEXTBOX },
  mainButtonLink: { type: FT.TEXTBOX },
  mainButtonDescription: { type: FT.TEXTAREA },
  // links: {
  //   type: FT.TEXTBOX_ARRAY,
  //   fields: [
  //     {
  //       name: "name",
  //       label: L.links.name.label,
  //     },
  //     {
  //       name: "link",
  //       label: L.links.link.label,
  //     },
  //   ],
  // },
};

export default (values) =>
  Object.keys(fields).map((f) => ({
    ...fields[f],
    name: f,
    values: values[f],
    label: L[f] && L[f].label,
    description: L[f] && L[f].description,
    placeholder: L[f] && L[f].placeholder,
  }));
