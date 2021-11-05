import { Router } from "express";
import { applyAdmin, applyAdminGuest, applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { getUserFinancicalStatisticsController } from "../../../useCases/userFinancialStatistics/getUserFinancialStatistics";
import { addCardToUserController } from "../../../useCases/users/addCardToUser";
import { checkLoginController } from "../../../useCases/users/checkLogin";
import { createUserController } from "../../../useCases/users/createUser";
// import { createUserOrganizationController } from "../../../useCases/users/createUserOrganization";
import { getManagerOperationsController } from "../../../useCases/users/getManagerOperations";
import { getUserController } from "../../../useCases/users/getUser";
import { getUserByWisewinIdController } from "../../../useCases/users/getUserByWisewinId";
import { getUserCardController } from "../../../useCases/users/getUserCard";
import { getUserJwtController } from "../../../useCases/users/getUserJwt";
import { getWisewinManagerStatisticsController } from "../../../useCases/users/getWisewinManagerStatistics";
import { getWisewinStatisticsController } from "../../../useCases/users/getWisewinStatistics";
import { logoutController } from "../../../useCases/users/logout";
import { meController } from "../../../useCases/users/me";
import { removeCardFromUserController } from "../../../useCases/users/removeCardFromUser";
import { setUserRoleController } from "../../../useCases/users/setUserRole";
import { signInController } from "../../../useCases/users/signIn";
import { signInWithWisewinController } from "../../../useCases/users/signInWithWisewin";
import { updateUserController } from "../../../useCases/users/updateUser";
import '../../../useCases/userFinancialStatistics/updateUserFinancialStatistics';
import { setUserCityController } from "../../../useCases/users/setUserCity";
import { getUserTreeController } from "../../../useCases/users/getUserTree";
import { setUserParentController } from "../../../useCases/users/setUserParent";
import { getUserTreeChildrenController } from "../../../useCases/users/getUserTreeChildren";
import { setUserLanguageController } from "../../../useCases/users/setUserLanguage";

const userRouter = Router();

userRouter.post('/create-user', applyBlock, (req, res) => createUserController.execute(req, res));
userRouter.post('/sign-in', applyBlock, (req, res) => signInController.execute(req, res));
userRouter.get('/me', applyAuth, (req, res) => meController.execute(req, res));
userRouter.put('/update-user', applyBlock, applyAuth, (req, res) => updateUserController.execute(req, res));
userRouter.get('/check-login/:login', applyBlock, (req, res) => checkLoginController.execute(req, res));
userRouter.get('/logout', applyAuth, (req, res) => logoutController.execute(req, res));
// userRouter.post('/create-user-organization', applyBlock, (req, res) => createUserOrganizationController.execute(req, res));
userRouter.post('/sign-in-with-wisewin', applyBlock, (req, res) => signInWithWisewinController.execute(req, res));
userRouter.get('/get-user/:id', applyBlock, (req, res) => getUserController.execute(req, res));
userRouter.get('/get-user-financial-statistics', applyBlock, applyAuth, (req, res) => getUserFinancicalStatisticsController.execute(req, res));
userRouter.get('/get-user-by-wisewin-id/:id', applyBlock, applyAuth, (req, res) => getUserByWisewinIdController.execute(req, res));
userRouter.get('/get-wisewin-statistics', applyBlock, applyAuth, (req, res) => getWisewinStatisticsController.execute(req, res));
userRouter.get('/get-wisewin-statistics/:id', applyBlock, (req, res) => getWisewinStatisticsController.execute(req, res));
userRouter.get('/get-wisewin-manager-statistics/:id', applyBlock, applyAuth, (req, res) => getWisewinManagerStatisticsController.execute(req, res));
userRouter.get('/get-user-jwt/:id', applyBlock, applyAdminGuest, (req, res) => getUserJwtController.execute(req, res));
userRouter.put('/set-user-role/:id', applyBlock, applyAuth, (req, res) => setUserRoleController.execute(req, res));
userRouter.post('/add-card-to-user', applyBlock, applyAuth, (req, res) => addCardToUserController.execute(req, res));
userRouter.put('/remove-card-from-user', applyBlock, applyAuth, (req, res) => removeCardFromUserController.execute(req, res));
userRouter.get('/get-user-card', applyBlock, applyAuth, (req, res) => getUserCardController.execute(req, res));
userRouter.get('/get-manager-operations', applyBlock, applyAuth, (req, res) => getManagerOperationsController.execute(req, res));
userRouter.put('/set-user-city', applyBlock, applyAuth, (req, res) => setUserCityController.execute(req, res));
userRouter.get('/get-user-tree/:id', (req, res) => getUserTreeController.execute(req, res));
userRouter.get('/get-user-tree-children/:id', (req, res) => getUserTreeChildrenController.execute(req, res));
userRouter.put('/set-user-parent', applyBlock, applyAuth, (req, res) => setUserParentController.execute(req, res));
userRouter.put('/set-user-parent/:id', applyAdmin, (req, res) => setUserParentController.execute(req, res));
userRouter.put('/set-user-language/', applyBlock, applyAuth, (req, res) => setUserLanguageController.execute(req, res));

export {
    userRouter
};

/*
[
    {
        "name": "sign in",
        "path": "/accounts/users/sign-in",
        "dto": "src/app/modules/users/useCases/users/signIn/SignInDTO.ts",
        "errors": "src/app/modules/users/useCases/users/signIn/signInErrors.ts",
        "method": "POST",
        "description": "Вход в приложение."
    },
    {
        "name": "get user tree",
        "path": "/accounts/users/get-user-tree",
        "dto": "src/app/modules/users/useCases/users/getUserTree/GetUserTreeDTO.ts",
        "errors": "src/app/modules/users/useCases/users/getUserTree/getUserTreeErrors.ts",
        "method": "GET",
        "description": "Получить дерево пользователя."
    },
    {
        "name": "get user tree children",
        "path": "/accounts/users/get-user-tree-children",
        "dto": "src/app/modules/users/useCases/users/getUserTreeChildren/GetUserTreeChildrenDTO.ts",
        "errors": "src/app/modules/users/useCases/users/getUserTreeChildren/getUserTreeChildrenErrors.ts",
        "method": "GET",
        "description": "Получить дерево детей пользователя."
    },
    {
        "name": "set user city",
        "path": "/accounts/users/set-user-city",
        "dto": "src/app/modules/users/useCases/users/setUserCity/SetUserCityDTO.ts",
        "errors": "src/app/modules/users/useCases/users/setUserCity/setUserCityErrors.ts",
        "method": "PUT",
        "description": "Установить город пользователя"
    },
    {
        "name": "logout",
        "path": "/accounts/users/logout",
        "dto": "src/app/modules/users/useCases/users/logout/LogoutDTO.ts",
        "errors": "src/app/modules/users/useCases/users/logout/logoutErrors.ts",
        "method": "GET",
        "description": "Выход из приложения."
    },
    {
        "name": "sign in with wisewin",
        "path": "/accounts/users/sign-in-with-wisewin",
        "dto": "src/app/modules/users/useCases/users/signInWithWisewin/SignInWithWisewinDTO.ts",
        "errors": "src/app/modules/users/useCases/users/signInWithWisewin/signInWithWisewinErrors.ts",
        "method": "POST",
        "description": "Вход в приложение со сквозной авторизацией."
    },
    {
        "name": "check login",
        "path": "/accounts/users/check-login/{login}",
        "dto": "src/app/modules/users/useCases/users/checkLogin/CheckLoginDTO.ts",
        "errors": "src/app/modules/users/useCases/users/checkLogin/checkLoginErrors.ts",
        "method": "GET",
        "description": "Проверяет, есть ли пользователь с данным логином в приложении."
    },
    {
        "name": "get user jwt",
        "path": "/accounts/users/get-user-jwt/{userId}",
        "dto": "src/app/modules/users/useCases/users/getUserJwt/GetUserJwtDTO.ts",
        "errors": "src/app/modules/users/useCases/users/getUserJwt/getUserJwtErrors.ts",
        "method": "GET",
        "description": "Создаёт токен для пользователя с айди."
    },
    {
        "name": "get current user",
        "path": "/accounts/users/me?organization?={1 | 0}",
        "dto": "src/app/modules/users/useCases/users/me/MeDTO.ts",
        "errors": "src/app/modules/users/useCases/users/me/meErrors.ts",
        "method": "GET",
        "description": "Возвращает текущего пользователя."
    },
    {
        "name": "get user",
        "path": "/accounts/users/get-user/{userId}",
        "dto": "src/app/modules/users/useCases/users/getUser/GetUserDTO.ts",
        "errors": "src/app/modules/users/useCases/users/getUser/getUserErrors.ts",
        "method": "GET",
        "description": "Возвращает текущего пользователя."
    },
    {
        "name": "get user financial statistics",
        "path": "/accounts/users/get-user-financial-statistics",
        "dto": "src/app/modules/users/useCases/users/getUserFinancialStatistics/GetUserFinancialStatisticsDTO.ts",
        "errors": "src/app/modules/users/useCases/users/getUserFinancialStatistics/getUserFinancialStatisticsErrors.ts",
        "method": "GET",
        "description": "Возвращает финансовую статистику пользователя."
    },
    {
        "name": "get wisewin statistics",
        "path": "/accounts/users/get-wisewin-statistics",
        "dto": "src/app/modules/users/useCases/users/getWisewinStatistics/GetWisewinStatisticsDTO.ts",
        "errors": "src/app/modules/users/useCases/users/getWisewinStatistics/getWisewinStatisticsErrors.ts",
        "method": "GET",
        "description": "Возвращает финансовую статистику пользователя."
    },
    {
        "name": "get wisewin manager statistics",
        "path": "/accounts/users/get-wisewin-manager-statistics/{wisewinUserId}",
        "dto": "src/app/modules/users/useCases/users/getWisewinManagerStatistics/GetWisewinManagerStatisticsDTO.ts",
        "errors": "src/app/modules/users/useCases/users/getWisewinManagerStatistics/getWisewinManagerStatisticsErrors.ts",
        "method": "GET",
        "description": "Возвращает финансовую статистику менеджера вайс вин."
    },
    {
        "name": "update user",
        "path": "/accounts/users/update-user",
        "dto": "src/app/modules/users/useCases/users/updateUser/UpdateUserDTO.ts",
        "errors": "src/app/modules/users/useCases/users/updateUser/updateUserErrors.ts",
        "method": "PUT",
        "description": "Обновляет пользователя."
    },
    {
        "name": "create user",
        "path": "/accounts/users/create-user?cashier={boolean}",
        "dto": "src/app/modules/users/useCases/users/createUser/CreateUserDTO.ts",
        "errors": "src/app/modules/users/useCases/users/createUser/createUserErrors.ts",
        "method": "POST",
        "description": "Регистрирует нового пользователя в приложении, создаётся объект подтверждения."
    },
    {
        "name": "set user role",
        "path": "/accounts/users/set-user-role",
        "dto": "src/app/modules/users/useCases/users/setUserRole/SetUserRoleDTO.ts",
        "errors": "src/app/modules/users/useCases/users/setUserRole/setUserRoleErrors.ts",
        "method": "PUT",
        "description": "Установить роль пользователю."
    },
    {   
        "name": "Add card to user",
        "path": "/accounts/users/add-card-to-user",
        "dto": "src/app/modules/users/useCases/users/addCardToUser/AddCardToUserDTO.ts",
        "errors": "src/app/modules/users/useCases/users/addCardToUser/addCardToUserErrors.ts",
        "method": "POST",
        "description": "Создаёт запрос на добавление карты."
    },
    {   
        "name": "Remove card from user",
        "path": "/accounts/users/remove-card-from-user",
        "dto": "src/app/modules/users/useCases/users/removeCardFromUser/RemoveCardFromUserDTO.ts",
        "errors": "src/app/modules/users/useCases/users/removeCardFromUser/removeCardFromUserErrors.ts",
        "method": "PUT",
        "description": "Создаёт запрос на Удаление карты."
    },
    {   
        "name": "Get user card",
        "path": "/accounts/users/get-user-card",
        "dto": "src/app/modules/users/useCases/users/getUserCard/GetUserCardDTO.ts",
        "errors": "src/app/modules/users/useCases/users/getUserCard/getUserCardErrors.ts",
        "method": "GET",
        "description": "Получить карту пользователя."
    },
    {   
        "name": "Get manager operations",
        "path": "/accounts/users/get-manager-operations",
        "dto": "src/app/modules/users/useCases/users/getManagerOperations/GetManagerOperationsDTO.ts",
        "errors": "src/app/modules/users/useCases/users/getManagerOperations/getManagerOperationsErrors.ts",
        "method": "GET",
        "description": "Получить статистику менеджера."
    },
    {   
        "name": "Set user parent",
        "path": "/accounts/users/set-user-parent",
        "dto": "src/app/modules/users/useCases/users/setUserParent/SetUserParentDTO.ts",
        "errors": "src/app/modules/users/useCases/users/setUserParent/setUserParentErrors.ts",
        "method": "PUT",
        "description": "Устанавливает куратора для пользователя. (только с учетки пользователя, не админа)"
    },
    {   
        "name": "Set user parent as admin",
        "path": "/accounts/users/set-user-parent/{id}",
        "dto": "src/app/modules/users/useCases/users/setUserParent/SetUserParentDTO.ts",
        "errors": "src/app/modules/users/useCases/users/setUserParent/setUserParentErrors.ts",
        "method": "PUT",
        "description": "Устанавливает куратора для пользователя. (только с учетки админа)"
    },
    {   
        "name": "Set user language",
        "path": "/accounts/users/set-user-language",
        "dto": "src/app/modules/users/useCases/users/setUserLanguage/SetUserLanguageDTO.ts",
        "errors": "src/app/modules/users/useCases/users/setUserLanguage/setUserLanguageErrors.ts",
        "method": "PUT",
        "description": "Устанавливает язык пользователя."
    }
]
*/