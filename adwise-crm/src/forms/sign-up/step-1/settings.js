import { FIELD_TYPES as FT } from "../../../components/formbuilder/FormBuilder";
import { joinLexems } from "../../../forms/joinLexems";
import lexems from "../../../settings/lexems";

export const fields = {
  name: { type: FT.TEXTBOX },
  annotation: { type: FT.TEXTAREA },
  category: { type: FT.SELECT },
  tags: { type: FT.TEXTBOX_ARRAY },
};

export default joinLexems(fields, lexems.forms.signUpStep1);
