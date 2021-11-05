import {
  FIELD_TYPES as FT,
  // FIELD_MASKS as FM,
} from "../../../components/formbuilder/FormBuilder";

import lexems from "../../../settings/lexems";
const L = lexems.forms.information.addBranch;

const fields = {
  address: { type: FT.TEXTBOX },
  addressRefine: { type: FT.TEXTBOX },
  branchName: { type: FT.TEXTBOX },
  phone: { type: FT.TEXTBOX, }, // mask: FM.PHONE },
  shedule: {
    type: FT.SHEDULE,
  },
  fulltime: { type: FT.TOGGLE },
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
