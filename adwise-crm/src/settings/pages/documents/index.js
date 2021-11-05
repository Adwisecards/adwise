import B from "../blocktypes";
import documents from "./documents";

export default {
  pagetitle: "Документы",
  route: "documents",
  content: [{ block: B.CARD_LIST, values: documents }],
};
