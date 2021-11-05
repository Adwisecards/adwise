import { Router } from "express";
import { applyAdmin, applyAdminGuest, applyAuth, applyBlock } from "../../../../services/server/implementation/middleware/middlewares";
import { createAdvantageController } from "../../useCases/advantages/createAdvantage";
import { deleteAdvantageController } from "../../useCases/advantages/deleteAdvantage";
import { getAdvantagesController } from "../../useCases/advantages/getAdvantages";
import { updateAdvantageController } from "../../useCases/advantages/updateAdvantage";
import { createDocumentController } from "../../useCases/documents/createDocument";
import { deleteDocumentController } from "../../useCases/documents/deleteDocument";
import { getDocumentsByTypeController } from "../../useCases/documents/getDocumentsByType";
import { updateDocumentController } from "../../useCases/documents/updateDocument";
import { addTaskController } from "../../useCases/globals/addTask";
import { createGlobalShopController } from "../../useCases/globals/createGlobalShop";
import { disableTaskController } from "../../useCases/globals/disableTask";
import { findAllAccumulationsController } from "../../useCases/globals/findAllAccumulations";
import { findAllBankPaymentsController } from "../../useCases/globals/findAllBankPayments";
import { findAllContactsController } from "../../useCases/globals/findAllContacts";
import { findAllCouponsController } from "../../useCases/globals/findAllCoupons";
import { findAllInvitationsController } from "../../useCases/globals/findAllInvitations";
import { findAllLegalInfoRequestsController } from "../../useCases/globals/findAllLegalInfoRequests";
import { findAllLogsController } from "../../useCases/globals/findAllLogs";
import { findAllNotificationsController } from "../../useCases/globals/findAllNotifications";
import { findAllOrganizationsController } from "../../useCases/globals/findAllOrganizations";
import { findAllPacketsSoldController } from "../../useCases/globals/findAllPacketsSold";
import { findAllPaymentsController } from "../../useCases/globals/findAllPayments";
import { findAllPurchasesController } from "../../useCases/globals/findAllPurchases";
import { findAllReceiverGroupsController } from "../../useCases/globals/findAllReceiverGroups";
import { findAllRefsController } from "../../useCases/globals/findAllRefs";
import { findAllSubscriptionsController } from "../../useCases/globals/findAllSubscriptions";
import { findAllTipsController } from "../../useCases/globals/findAllTips";
import { findAllTransactionsController } from "../../useCases/globals/findAllTransactions";
import { findAllUsersController } from "../../useCases/globals/findAllUsers";
import { findAllWithdrawalRequestsController } from "../../useCases/globals/findAllWithdrawalRequests";
import { findSubscriptionCreatedRecordsController } from "../../useCases/globals/findSubscriptionCreatedRecords";
import { getGlobalController } from "../../useCases/globals/getGlobal";
import { getOrganizationReportController } from "../../useCases/globals/getOrganizationReport";
import { getRefTreeOfOrganizationController } from "../../useCases/globals/getRefTreeOfOrganization";
import { setOrganizationGlobalController } from "../../useCases/globals/setOrganizationGlobal";
import { setUserAdminController } from "../../useCases/globals/setUserAdmin";
import { setUserAdminGuestController } from "../../useCases/globals/setUserAdminGuest";
import { updateGlobalController } from "../../useCases/globals/updateGlobal";
import { createPartnerController } from "../../useCases/partners/createPartner";
import { deletePartnerController } from "../../useCases/partners/deletePartner";
import { getPartnersController } from "../../useCases/partners/getPartners";
import { updatePartnerController } from "../../useCases/partners/updatePartner";
import { createQuestionCategoryController } from "../../useCases/questionCategories/createQuestionCategory";
import { deleteQuestionCategoryController } from "../../useCases/questionCategories/deleteQuestionCategory";
import { getQuestionCategoriesController } from "../../useCases/questionCategories/getQuestionCategories";
import { createQuestionController } from "../../useCases/questions/createQuestion";
import { deleteQuestionController } from "../../useCases/questions/deleteQuestion";
import { getQuestionsByTypeController } from "../../useCases/questions/getQuestionsByType";
import { updateQuestionController } from "../../useCases/questions/updateQuestion";
import { createVersionController } from "../../useCases/versions/createVersion";
import { deleteVersionController } from "../../useCases/versions/deleteVersion";
import { getVersionsController } from "../../useCases/versions/getVersions";
import { updateVersionController } from "../../useCases/versions/updateVersion";

const administrationRouter = Router();

administrationRouter.get('/find-users', applyAdminGuest, (req, res) => findAllUsersController.execute(req, res));
administrationRouter.get('/find-organizations', applyAdminGuest, (req, res) => findAllOrganizationsController.execute(req, res));
administrationRouter.get('/find-transactions', applyAdminGuest, (req, res) => findAllTransactionsController.execute(req, res));
administrationRouter.get('/find-withdrawal-requests', applyAdmin, (req, res) => findAllWithdrawalRequestsController.execute(req, res));
administrationRouter.get('/find-purchases', applyAdminGuest, (req, res) => findAllPurchasesController.execute(req, res));
administrationRouter.get('/get-global', (req, res) => getGlobalController.execute(req, res));
administrationRouter.put('/set-user-admin/:id', applyAdmin, (req, res) => setUserAdminController.execute(req, res));
administrationRouter.put('/set-user-admin-guest/:id', applyAuth, applyAdmin, (req, res) => setUserAdminGuestController.execute(req, res));
administrationRouter.put('/update-global', applyAdmin, (req, res) => updateGlobalController.execute(req, res));
administrationRouter.get('/get-organization-ref-tree/:id', applyAdmin, (req, res) => getRefTreeOfOrganizationController.execute(req, res));
administrationRouter.put('/add-task', applyAdmin, (req, res) => addTaskController.execute(req, res));
administrationRouter.get('/find-coupons', applyAdmin, (req, res) => findAllCouponsController.execute(req, res));
administrationRouter.get('/find-sold-packets', applyAdmin, (req, res) => findAllPacketsSoldController.execute(req, res));
administrationRouter.get('/find-payments', applyAdminGuest, (req, res) => findAllPaymentsController.execute(req, res));
administrationRouter.put('/set-task-disabled/:id', applyAdmin, (req, res) => disableTaskController.execute(req, res));
administrationRouter.get('/find-subscription-created-records', applyAdmin, (req, res) => findSubscriptionCreatedRecordsController.execute(req, res));
administrationRouter.put('/create-global-shop', applyBlock, applyAdmin, (req, res) => createGlobalShopController.execute(req, res));
administrationRouter.get('/find-tips', applyAdmin, (req, res) => findAllTipsController.execute(req, res));
administrationRouter.get('/find-contacts', applyAdmin, (req, res) => findAllContactsController.execute(req, res));
administrationRouter.get('/find-bank-payments', applyAdmin, (req, res) => findAllBankPaymentsController.execute(req, res));
administrationRouter.put('/set-organization-global/:id', applyAdmin, (req, res) => setOrganizationGlobalController.execute(req, res));
administrationRouter.get('/find-accumulations', applyAdmin, (req, res) => findAllAccumulationsController.execute(req, res));
administrationRouter.get('/find-subscriptions', applyAdmin, (req, res) => findAllSubscriptionsController.execute(req, res));
administrationRouter.get('/find-notifications', applyAdmin, (req, res) => findAllNotificationsController.execute(req, res));
administrationRouter.get('/find-receiver-groups', applyAdmin, (req, res) => findAllReceiverGroupsController.execute(req, res));
administrationRouter.get('/get-organization-report/:id', (req, res) => getOrganizationReportController.execute(req, res));
administrationRouter.get('/find-logs', applyAdmin, (req, res) => findAllLogsController.execute(req, res));
administrationRouter.get('/find-refs', applyAdmin, (req, res) => findAllRefsController.execute(req, res));
administrationRouter.get('/find-legal-info-requests', applyAdmin, (req, res) => findAllLegalInfoRequestsController.execute(req, res));
administrationRouter.get('/find-invitations', applyAdmin, (req, res) => findAllInvitationsController.execute(req, res));

administrationRouter.post('/create-question-category', applyAdmin, (req, res) => createQuestionCategoryController.execute(req, res));
administrationRouter.get('/get-question-categories', (req, res) => getQuestionCategoriesController.execute(req, res));
administrationRouter.delete('/delete-question-category/:id', (req, res) => deleteQuestionCategoryController.execute(req, res));
administrationRouter.post('/create-question', applyAdmin, (req, res) => createQuestionController.execute(req, res));
administrationRouter.put('/update-question/:id', applyAdmin, (req, res) => updateQuestionController.execute(req, res));
administrationRouter.get('/get-questions-by-type/:type', applyBlock, (req, res) => getQuestionsByTypeController.execute(req, res));
administrationRouter.delete('/delete-question/:id', applyAdmin, (req, res) => deleteQuestionController.execute(req, res));

administrationRouter.post('/create-version', applyAdmin, (req, res) => createVersionController.execute(req, res));
administrationRouter.get('/get-versions', (req, res) => getVersionsController.execute(req, res));
administrationRouter.delete('/delete-version/:id', applyAdmin, (req, res) => deleteVersionController.execute(req, res));
administrationRouter.put('/update-version/:id', applyAdmin, (req, res) => updateVersionController.execute(req, res));

administrationRouter.post('/create-advantage', applyAdmin, (req, res) => createAdvantageController.execute(req, res));
administrationRouter.put('/update-advantage/:id', applyAdmin, (req, res) => updateAdvantageController.execute(req, res));
administrationRouter.delete('/delete-advantage/:id', applyAdmin, (req, res) => deleteAdvantageController.execute(req, res));
administrationRouter.get('/get-advantages', applyBlock, (req, res) => getAdvantagesController.execute(req, res));

administrationRouter.post('/create-partner', applyAdmin, (req, res) => createPartnerController.execute(req, res));
administrationRouter.put('/update-partner/:id', applyAdmin, (req, res) => updatePartnerController.execute(req, res));
administrationRouter.delete('/delete-partner/:id', applyAdmin, (req, res) => deletePartnerController.execute(req, res));
administrationRouter.get('/get-partners', applyBlock, (req, res) => getPartnersController.execute(req, res));

administrationRouter.post('/create-document', applyAdmin, (req, res) => createDocumentController.execute(req, res));
administrationRouter.put('/update-document/:id', applyAdmin, (req, res) => updateDocumentController.execute(req, res));
administrationRouter.delete('/delete-document/:id', applyAdmin, (req, res) => deleteDocumentController.execute(req, res));
administrationRouter.get('/get-documents-by-type/:type', applyBlock, (req, res) => getDocumentsByTypeController.execute(req, res));

export {
    administrationRouter
};

/*
[
    {   
        "name": "find users",
        "path": "/administration/find-users?parameterName={parameterName}&parameterValue={parameterValue}&sortBy={sortBy}&order={order}&pageSize={pageSize}&pageNumber={pageNumber}",
        "dto": "src/app/modules/administration/useCases/globals/findAllUsers/FindAllUsersDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/findAllUsers/findAllUsersErrors.ts",
        "method": "GET",
        "description": "Ищет пользователей по базе данных."
    },
    {   
        "name": "find legal info requests",
        "path": "/administration/find-legal-info-requests?parameterName={parameterName}&parameterValue={parameterValue}&sortBy={sortBy}&order={order}&pageSize={pageSize}&pageNumber={pageNumber}",
        "dto": "src/app/modules/administration/useCases/globals/findAllLegalInfoRequests/FindAllLegalInfoRequestsDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/findAllLegalInfoRequests/findAllLegalInfoRequestsErrors.ts",
        "method": "GET",
        "description": "Ищет запросы о смене реквизитов по базе данных."
    },
    {   
        "name": "find refs",
        "path": "/administration/find-refs?parameterName={parameterName}&parameterValue={parameterValue}&sortBy={sortBy}&order={order}&pageSize={pageSize}&pageNumber={pageNumber}",
        "dto": "src/app/modules/administration/useCases/globals/findAllRefs/FindAllRefsDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/findAllRefs/findAllRefsErrors.ts",
        "method": "GET",
        "description": "Ищет ссылки по базе данных."
    },
    {   
        "name": "find logs",
        "path": "/administration/find-logs?parameterName={parameterName}&parameterValue={parameterValue}&sortBy={sortBy}&order={order}&pageSize={pageSize}&pageNumber={pageNumber}",
        "dto": "src/app/modules/administration/useCases/globals/findAllLogs/FindAllLogsDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/findAllLogs/findAllLogsErrors.ts",
        "method": "GET",
        "description": "Ищет логи по базе данных."
    },
    {   
        "name": "Get organization report",
        "path": "/administration/get-organization-report/{organizationId}",
        "dto": "src/app/modules/administration/useCases/globals/getOrganizationReport/GetOrganizationReportDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/getOrganizationReport/getOrganizationReportErrors.ts",
        "method": "GET",
        "description": "Возвращает отчет по организации."
    },
    {   
        "name": "find subscriptions",
        "path": "/administration/find-subscriptions?parameterName={parameterName}&parameterValue={parameterValue}&sortBy={sortBy}&order={order}&pageSize={pageSize}&pageNumber={pageNumber}",
        "dto": "src/app/modules/administration/useCases/globals/findAllSubscriptions/FindAllSubscriptionsDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/findAllSubscriptions/findAllSubscriptionsErrors.ts",
        "method": "GET",
        "description": "Ищет подписки по базе данных."
    },
    {   
        "name": "find subscription created records",
        "path": "/administration/find-subscription-created-records?parameterName={parameterName}&parameterValue={parameterValue}&sortBy={sortBy}&order={order}&pageSize={pageSize}&pageNumber={pageNumber}",
        "dto": "src/app/modules/administration/useCases/globals/findSubscriptionCreatedRecords/FindSubscriptionCreatedRecordsDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/findSubscriptionCreatedRecords/findSubscriptionCreatedRecordsErrors.ts",
        "method": "GET",
        "description": "Ищет записи о созданных подписках по базе данных."
    },
    {   
        "name": "find payments",
        "path": "/administration/find-payments?parameterName={parameterName}&parameterValue={parameterValue}&sortBy={sortBy}&order={order}&pageSize={pageSize}&pageNumber={pageNumber}&export={1}",
        "dto": "src/app/modules/administration/useCases/globals/findAllPayments/FindAllPaymentsDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/findAllPayments/findAllPaymentsErrors.ts",
        "method": "GET",
        "description": "Ищет платежи по базе данных."
    },
    {   
        "name": "find accumulations",
        "path": "/administration/find-accumulations?parameterName={parameterName}&parameterValue={parameterValue}&sortBy={sortBy}&order={order}&pageSize={pageSize}&pageNumber={pageNumber}",
        "dto": "src/app/modules/administration/useCases/globals/findAllAccumulations/FindAllAccumulationsDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/findAllAccumulations/findAllAccumulationsErrors.ts",
        "method": "GET",
        "description": "Ищет записи о накоплениях по базе данных."
    },
    {   
        "name": "find invitations",
        "path": "/administration/find-invitations?parameterName={parameterName}&parameterValue={parameterValue}&sortBy={sortBy}&order={order}&pageSize={pageSize}&pageNumber={pageNumber}",
        "dto": "src/app/modules/administration/useCases/globals/findAllInvitations/FindAllInvitationsDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/findAllInvitations/findAllInvitationsErrors.ts",
        "method": "GET",
        "description": "Ищет приглашения по базе данных."
    },
    {   
        "name": "find sold packets",
        "path": "/administration/find-sold-packets?parameterName={parameterName}&parameterValue={parameterValue}&sortBy={sortBy}&order={order}&pageSize={pageSize}&pageNumber={pageNumber}&export={1}",
        "dto": "src/app/modules/administration/useCases/globals/findAllPacketsSold/FindAllPacketsSoldDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/findAllPacketsSold/findAllPacketsSoldErrors.ts",
        "method": "GET",
        "description": "Ищет проданные тарифы по базе данных."
    },
    {   
        "name": "find coupons",
        "path": "/administration/find-coupons?parameterName={parameterName}&parameterValue={parameterValue}&sortBy={sortBy}&order={order}&pageSize={pageSize}&pageNumber={pageNumber}",
        "dto": "src/app/modules/administration/useCases/globals/findAllCoupons/FindAllCouponsDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/findAllCoupons/findAllCouponsErrors.ts",
        "method": "GET",
        "description": "Ищет купоны по базе данных."
    },
    {   
        "name": "find withdrawal requests",
        "path": "/administration/find-withdrawal-requests?parameterName={parameterName}&parameterValue={parameterValue}&sortBy={sortBy}&order={order}&pageSize={pageSize}&pageNumber={pageNumber}",
        "dto": "src/app/modules/administration/useCases/globals/findAllWithdrawalRequests/FindAllWithdrawalRequestsDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/findAllWithdrawalRequests/findAllWithdrawalRequestsErrors.ts",
        "method": "GET",
        "description": "Ищет пользователей по базе данных."
    },
    {   
        "name": "get global",
        "path": "/administration/get-global",
        "dto": "src/app/modules/administration/useCases/globals/getGlobal/GetGlobalDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/getGlobal/getGlobalErrors.ts",
        "method": "GET",
        "description": "Возвращает объект с глобальными настройками, переменными."
    },
    {   
        "name": "get ref tree of organization",
        "path": "/administration/get-organization-ref-tree/{orgnaizationId}",
        "dto": "src/app/modules/administration/useCases/globals/getRefTreeOfOrganization/GetRefTreeOfOrganizationDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/getRefTreeOfOrganization/getRefTreeOfOrganizationErrors.ts",
        "method": "GET",
        "description": "Возвращает объект с глобальными настройками, переменными."
    },
    {   
        "name": "update global",
        "path": "/administration/update-global",
        "dto": "src/app/modules/administration/useCases/globals/updateGlobal/UpdateGlobalDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/updateGlobal/updateGlobalErrors.ts",
        "method": "PUT",
        "description": "Изменяет глобальные настройки, переменные."
    },
    {   
        "name": "add task to global",
        "path": "/administration/add-task",
        "dto": "src/app/modules/administration/useCases/globals/addTask/AddTaskDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/addTask/addTaskErrors.ts",
        "method": "PUT",
        "description": "Создаёт задачу для вывода."
    },
    {   
        "name": "set user admin",
        "path": "/administration/set-user-admin/{id}",
        "dto": "src/app/modules/administration/useCases/globals/setUserAdmin/SetUserAdminDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/setUserAdmin/setUserAdminErrors.ts",
        "method": "PUT",
        "description": "Устанавливает свойство admin у пользователя."
    },
    {   
        "name": "set user admin guest",
        "path": "/administration/set-user-admin-guest/{id}",
        "dto": "src/app/modules/administration/useCases/globals/setUserAdminGuest/SetUserAdminGuestDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/setUserAdminGuest/setUserAdminGuestErrors.ts",
        "method": "PUT",
        "description": "Устанавливает свойство admin guest у пользователя."
    },
    {   
        "name": "find organizations",
        "path": "/administration/find-organizations?parameterName={parameterName}&parameterValue={parameterValue}&sortBy={sortBy}&order={order}&pageSize={pageSize}&pageNumber={pageNumber}",
        "dto": "src/app/modules/administration/useCases/globals/findAllOrganizations/FindAllOrganizationsDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/findAllOrganizations/findAllOrganizationsErrors.ts",
        "method": "GET",
        "description": "Ищет организации по базе данных."
    },
    {   
        "name": "find transactions",
        "path": "/administration/find-transactions?parameterName={parameterName}&parameterValue={parameterValue}&sortBy={sortBy}&order={order}&pageSize={pageSize}&pageNumber={pageNumber}",
        "dto": "src/app/modules/administration/useCases/globals/findAllTransactions/FindAllTransactionsDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/findAllTransactions/findAllTransactionsErrors.ts",
        "method": "GET",
        "description": "Ищет организации по базе данных."
    },
    {   
        "name": "find purchases",
        "path": "/administration/find-purchases?parameterName={parameterName}&parameterValue={parameterValue}&sortBy={sortBy}&order={order}&pageSize={pageSize}&pageNumber={pageNumber}",
        "dto": "src/app/modules/administration/useCases/globals/findAllPurchases/FindAllPurchasesDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/findAllPurchases/findAllPurchasesErrors.ts",
        "method": "GET",
        "description": "Ищет организации по базе данных."
    },
    {   
        "name": "find tips",
        "path": "/administration/find-tips?parameterName={parameterName}&parameterValue={parameterValue}&sortBy={sortBy}&order={order}&pageSize={pageSize}&pageNumber={pageNumber}",
        "dto": "src/app/modules/administration/useCases/globals/findAllTips/FindAllTipsDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/findAllTips/findAllTipsErrors.ts",
        "method": "GET",
        "description": "Ищет чаевые по базе данных."
    },
    {   
        "name": "set task disabled",
        "path": "/administration/set-task-disabled",
        "dto": "src/app/modules/administration/useCases/globals/disableTask/DisableTaskDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/disableTask/disableTaskErrors.ts",
        "method": "PUT",
        "description": "Отключает задание."
    },
    {   
        "name": "Create version",
        "path": "/administration/create-version",
        "dto": "src/app/modules/administration/useCases/versions/createVersion/CreateVersionDTO.ts",
        "errors": "src/app/modules/administration/useCases/versions/createVersion/createVersionErrors.ts",
        "method": "POST",
        "description": "Создаёт версию."
    },
    {   
        "name": "Get versions",
        "path": "/administration/get-versions?type={type}",
        "dto": "src/app/modules/administration/useCases/versions/deleteVersion/DeleteVersionDTO.ts",
        "errors": "src/app/modules/administration/useCases/versions/deleteVersion/deleteVersionErrors.ts",
        "method": "DELETE",
        "description": "Удаляет версию."
    },
    {   
        "name": "Delete version",
        "path": "/administration/delete-version/{versionId}",
        "dto": "src/app/modules/administration/useCases/versions/deleteVersion/DeleteVersionDTO.ts",
        "errors": "src/app/modules/administration/useCases/versions/deleteVersion/deleteVersionErrors.ts",
        "method": "DELETE",
        "description": "Удаляет версию."
    },
    {   
        "name": "Update version",
        "path": "/administration/update-version/{versionId}",
        "dto": "src/app/modules/administration/useCases/versions/updateVersion/UpdateVersionDTO.ts",
        "errors": "src/app/modules/administration/useCases/versions/updateVersion/updateVersionErrors.ts",
        "method": "PUT",
        "description": "Обновляет версию."
    },
    {   
        "name": "Create global shop",
        "path": "/administration/create-global-shop",
        "dto": "src/app/modules/administration/useCases/globals/createGlobalShop/CreateGlobalShopDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/createGlobalShop/createGlobalShopErrors.ts",
        "method": "PUT",
        "description": "Создаёт системную точку."
    },
    {   
        "name": "find contacts",
        "path": "/administration/find-contacts?parameterName={parameterName}&parameterValue={parameterValue}&sortBy={sortBy}&order={order}&pageSize={pageSize}&pageNumber={pageNumber}",
        "dto": "src/app/modules/administration/useCases/globals/findAllContacts/FindAllContactsDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/findAllContacts/findAllContactsErrors.ts",
        "method": "GET",
        "description": "Ищет визитки по базе данных."
    },
    {   
        "name": "set organization global",
        "path": "/administration/set-organization-global/{id}",
        "dto": "src/app/modules/administration/useCases/globals/setOrganizationGlobal/SetOrganizationGlobalDTO.ts",
        "errors": "src/app/modules/administration/useCases/globals/setOrganizationGlobal/setOrganizationGlobalErrors.ts",
        "method": "PUT",
        "description": "Ставит организацию как глобальную."
    },
    {   
        "name": "create question category",
        "path": "/administration/create-question-category",
        "dto": "src/app/modules/administration/useCases/questionCategories/createQuestionCategory/CreateQuestionCategoryDTO.ts",
        "errors": "src/app/modules/administration/useCases/questionCategories/createQuestionCategory/createQuestionCategoryErrors.ts",
        "method": "POST",
        "description": "Создаёт категорию вопросов."
    },
    {   
        "name": "get question categories",
        "path": "/administration/get-question-categories",
        "dto": "src/app/modules/administration/useCases/questionCategories/getQuestionCategories/GetQuestionCategoriesDTO.ts",
        "errors": "src/app/modules/administration/useCases/questionCategories/getQuestionCategories/getQuestionCategoriesErrors.ts",
        "method": "GET",
        "description": "Возвращает категории вопросов."
    },
    {   
        "name": "delete question category",
        "path": "/administration/delete-question-category/{id}",
        "dto": "src/app/modules/administration/useCases/questionCategories/deleteQuestionCategory/DeleteQuestionCategoryDTO.ts",
        "errors": "src/app/modules/administration/useCases/questionCategories/deleteQuestionCategory/deleteQuestionCategoryErrors.ts",
        "method": "DELETE",
        "description": "Возвращает категории вопросов."
    },
    {   
        "name": "create question",
        "path": "/administration/create-question",
        "dto": "src/app/modules/administration/useCases/questions/createQuestion/CreateQuestionDTO.ts",
        "errors": "src/app/modules/administration/useCases/questions/createQuestion/createQuestionErrors.ts",
        "method": "POST",
        "description": "Создаёт вопрос. (type = crm | cards | business)"
    },
    {   
        "name": "delete question",
        "path": "/administration/delete-question/{id}",
        "dto": "src/app/modules/administration/useCases/questions/deleteQuestion/DeleteQuestionDTO.ts",
        "errors": "src/app/modules/administration/useCases/questions/deleteQuestion/deleteQuestionErrors.ts",
        "method": "DELETE",
        "description": "Удаляет вопрос."
    },
    {   
        "name": "update question",
        "path": "/administration/update-question/{id}",
        "dto": "src/app/modules/administration/useCases/questions/updateQuestion/UpdateQuestionDTO.ts",
        "errors": "src/app/modules/administration/useCases/questions/updateQuestion/updateQuestionErrors.ts",
        "method": "PUT",
        "description": "Изменяет вопрос."
    },
    {   
        "name": "get questions by type",
        "path": "/administration/get-questions-by-type/{type = crm | cards | business}",
        "dto": "src/app/modules/administration/useCases/questions/getQuestionsByType/GetQuestionsByTypeDTO.ts",
        "errors": "src/app/modules/administration/useCases/questions/getQuestionsByType/getQuestionsByTypeErrors.ts",
        "method": "GET",
        "description": "Возвращает вопросы по типу."
    },
    {   
        "name": "create advantage",
        "path": "/administration/create-advantage",
        "dto": "src/app/modules/administration/useCases/advantages/createAdvantage/CreateAdvantageDTO.ts",
        "errors": "src/app/modules/administration/useCases/advantages/createAdvantage/createAdvantageErrors.ts",
        "method": "POST",
        "description": "Создаёт преимущество."
    },
    {   
        "name": "delete advantage",
        "path": "/administration/delete-advantage/{id}",
        "dto": "src/app/modules/administration/useCases/advantages/deleteAdvantage/DeleteAdvantageDTO.ts",
        "errors": "src/app/modules/administration/useCases/advantages/deleteAdvantage/deleteAdvantageErrors.ts",
        "method": "DELETE",
        "description": "Удаляет преимущество."
    },
    {   
        "name": "update advantage",
        "path": "/administration/update-advantage/{id}",
        "dto": "src/app/modules/administration/useCases/advantages/updateAdvantage/UpdateAdvantageDTO.ts",
        "errors": "src/app/modules/administration/useCases/advantages/updateAdvantage/updateAdvantageErrors.ts",
        "method": "PUT",
        "description": "Обновляет преимущество."
    },
    {   
        "name": "get advantages",
        "path": "/administration/get-advantages",
        "dto": "src/app/modules/administration/useCases/advantages/getAdvantages/GetAdvantagesDTO.ts",
        "errors": "src/app/modules/administration/useCases/advantages/getAdvantages/getAdvantagesErrors.ts",
        "method": "GET",
        "description": "Возвращает преимущества."
    },
    {   
        "name": "create partner",
        "path": "/administration/create-partner",
        "dto": "src/app/modules/administration/useCases/partners/createPartner/CreatePartnerDTO.ts",
        "errors": "src/app/modules/administration/useCases/partners/createPartner/createPartnerErrors.ts",
        "method": "POST",
        "description": "Создаёт партнера."
    },
    {   
        "name": "update partner",
        "path": "/administration/update-partner/{id}",
        "dto": "src/app/modules/administration/useCases/partners/updatePartner/UpdatePartnerDTO.ts",
        "errors": "src/app/modules/administration/useCases/partners/updatePartner/updatePartnerErrors.ts",
        "method": "PUT",
        "description": "Обновляет партнера."
    },
    {   
        "name": "delete partner",
        "path": "/administration/delete-partner/{id}",
        "dto": "src/app/modules/administration/useCases/partners/deletePartner/DeletePartnerDTO.ts",
        "errors": "src/app/modules/administration/useCases/partners/deletePartner/deletePartnerErrors.ts",
        "method": "DELETE",
        "description": "Удаляет партнера."
    },
    {   
        "name": "get partners",
        "path": "/administration/get-partners",
        "dto": "src/app/modules/administration/useCases/partners/getPartners/GetPartnersDTO.ts",
        "errors": "src/app/modules/administration/useCases/partners/getPartners/getPartnersErrors.ts",
        "method": "GET",
        "description": "Возвращает партнеров."
    },
    {   
        "name": "create document",
        "path": "/administration/create-document",
        "dto": "src/app/modules/administration/useCases/documents/createDocument/CreateDocumentDTO.ts",
        "errors": "src/app/modules/administration/useCases/documents/createDocument/createDocumentErrors.ts",
        "method": "POST",
        "description": "Создаёт документ."
    },
    {   
        "name": "update document",
        "path": "/administration/update-document/{id}",
        "dto": "src/app/modules/administration/useCases/documents/updateDocument/UpdateDocumentDTO.ts",
        "errors": "src/app/modules/administration/useCases/documents/updateDocument/updateDocumentErrors.ts",
        "method": "PUT",
        "description": "Обновляет документ."
    },
    {   
        "name": "delete document",
        "path": "/administration/delete-document/{id}",
        "dto": "src/app/modules/administration/useCases/documents/deleteDocument/DeleteDocumentDTO.ts",
        "errors": "src/app/modules/administration/useCases/documents/deleteDocument/deleteDocumentErrors.ts",
        "method": "DELETE",
        "description": "Удаляет документ."
    },
    {   
        "name": "get documents by type",
        "path": "/administration/get-documents-by-type/{type}",
        "dto": "src/app/modules/administration/useCases/documents/getDocumentsByType/GetDocumentsByTypeDTO.ts",
        "errors": "src/app/modules/administration/useCases/documents/getDocumentsByType/getDocumentsByTypeErrors.ts",
        "method": "GET",
        "description": "Возвращает документы по типу {crm | business}."
    }
]
*/