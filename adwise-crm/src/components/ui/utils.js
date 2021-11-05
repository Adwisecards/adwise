const borderRadius = (radius, direction) => {
  let params = "";
  if (direction === "left") {
    params = `${radius}px 0 0 ${radius}px`;
  } else if (direction === "right") {
    params = `0 ${radius}px ${radius}px 0`;
  }
  return `border-radius: ${params};`;
};

export default {
  borderRadius,
};
