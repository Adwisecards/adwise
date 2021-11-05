import * as yup from "yup";

const lexems = {
  login: {
    required: "Введите ваш Логин",
  },
  password: {
    required: "Введите пароль",
    matches: "Must Contain 8 Characters",
  },
};

const passwordRegExp =
  "^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$";

export default yup.object().shape({
  login: yup.string().required(lexems.login.required),
  password: yup
    .string()
    .required(lexems.password.required)
    .matches(passwordRegExp, lexems.password.matches),
});
