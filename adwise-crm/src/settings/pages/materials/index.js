import B from "../blocktypes";
import materials from "./materials";

export default {
  pagetitle: "Материалы",
  route: "materials",
  content: [{ block: B.CARD_LIST, values: materials }],
};
