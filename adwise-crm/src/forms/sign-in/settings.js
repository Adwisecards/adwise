import { FIELD_TYPES as FT } from "../../components/formbuilder/FormBuilder";
import { joinLexems } from "../../forms/joinLexems";
import lexems from "../../settings/lexems";

export const fields = {
  login: { type: FT.TEXTBOX },
  password: { type: FT.TEXTBOX },
};

export default joinLexems(fields, lexems.forms.signIn);
