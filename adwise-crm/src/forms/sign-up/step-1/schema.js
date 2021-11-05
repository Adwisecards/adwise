import * as yup from "yup";

const lexems = {
  firstName: {
    required: "Введите ваше Имя",
  },
  lastName: {
    required: "Введите вашу Фамилию",
  },
  password: {
    required: "Введите пароль",
    matches:
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character",
  },
  confirmPassword: {
    required: "Повторите пароль",
    match: "Passwords must match",
  },
};

const passwordRegExp =
  "^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$";

export default yup.object().shape({
  firstName: yup.string().required(lexems.firstName.required),
  lastName: yup.string().required(lexems.lastName.required),
  password: yup
    .string()
    .required(lexems.password.required)
    .matches(passwordRegExp, lexems.password.matches),
  confirmPassword: yup
    .string()
    .required(lexems.confirmPassword.required)
    .oneOf([yup.ref("password"), null], lexems.confirmPassword.match),
});
