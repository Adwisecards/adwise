export const joinLexems = (fields, lexemSection) => {
  const L = lexemSection;
  return Object.keys(fields).map((f) => ({
    ...fields[f],
    name: f,
    label: L[f] && L[f].label,
    description: L[f] && L[f].description,
    placeholder: L[f] && L[f].placeholder,
  }));
};
