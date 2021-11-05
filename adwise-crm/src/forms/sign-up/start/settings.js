import { FIELD_TYPES as FT } from "../../../components/formbuilder/FormBuilder";
import { joinLexems } from "../../../forms/joinLexems";
import lexems from "../../../settings/lexems";

export const fields = {
  firstName: { type: FT.TEXTBOX },
  lastName: { type: FT.TEXTBOX },
  phone: { type: FT.MASKED_TEXTBOX },
  email: { type: FT.TEXTBOX },
  password: { type: FT.TEXTBOX },
  confirmPassword: { type: FT.TEXTBOX },
  country: { type: FT.SELECT },
  privacyPolicy: { type: FT.CHECKBOX },
  offerAgreement: { type: FT.CHECKBOX },
};

export default joinLexems(fields, lexems.forms.signUp);
