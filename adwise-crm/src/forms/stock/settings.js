import {
  FIELD_TYPES as FT,
  // FIELD_MASKS as FM,
} from "../../components/formbuilder/FormBuilder";

import categories from "../../settings/data/categories";

import lexems from "../../settings/lexems";
const L = lexems.forms.stock.create;

const fields = {
  name: { type: FT.TEXTBOX },
  description: { type: FT.TEXTAREA },
  category: { type: FT.SELECT, options: categories },
  shedule: {
    type: FT.SHEDULE,
  },
  stockProduct: { type: FT.CHECKBOX },
  loyaltyOff: { type: FT.CHECKBOX },
  variants: {
    type: FT.TEXTBOX_ARRAY,
    schema: {
      name: { type: FT.TEXTBOX },
      price: { type: FT.TEXTBOX },
      discountPrice: { type: FT.TEXTBOX },
      code: { type: FT.TEXTBOX },
    },
    addButton: L.variants.addButton,
  },
};

const fieldsWithLexems = () =>
  Object.keys(fields).map((f) => ({
    ...fields[f],
    name: f,
    label: (L[f] && L[f].label) || L[f],
    description: L[f] && L[f].description,
    placeholder: L[f] && L[f].placeholder,
  }));

export default (values = {}) =>
  Object.keys(fieldsWithLexems).map((f) => ({
    ...fields[f],
    values: values[f],
  }));
