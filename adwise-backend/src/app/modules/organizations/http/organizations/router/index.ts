import { Router } from "express";
import { applyAdmin, applyAdminGuest, applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { createOrganizationController } from "../../../useCases/organizations/createOrganization";
import { findOrganizationsController } from "../../../useCases/organizations/findOrganizations";
import { getOrganizationController } from "../../../useCases/organizations/getOrganization";
import { getOrganizationByInvitationController } from "../../../useCases/organizations/getOrganizationByInvitation";
import { getOrganizationClientController } from "../../../useCases/organizations/getOrganizationClient";
import { getOrganizationClientsController } from "../../../useCases/organizations/getOrganizationClients";
import { getOrganizationCouponsController } from "../../../useCases/organizations/getOrganizationCoupons";
import { getOrganizationEmployeesController } from "../../../useCases/organizations/getOrganizationEmployees";
import { getOrganizationProductsController } from "../../../useCases/organizations/getOrganizationProducts";
import { getOrganizationPurchasesController } from "../../../useCases/organizations/getOrganizationPurchases";
import { setManagerController } from "../../../useCases/organizations/setManager";
import { subscribeToOrganizationController } from "../../../useCases/organizations/subscribeToOrganization";
import { unsubscribeFromOrganizationController } from "../../../useCases/organizations/unsubscribeFromOrganization";
import { updateOrganizationController } from "../../../useCases/organizations/updateOrganization";
import '../../../useCases/organizations/checkOrganizationPackets';
import { setOrganizationDisabledController } from "../../../useCases/organizations/setOrganizationDisabled";
import { getManagerOrganizationsController } from "../../../useCases/organizations/getManagerOrganizations";
import { sendDocumentsController } from "../../../useCases/organizations/sendDocuments";
import { getOrganizationOperationsController } from "../../../useCases/organizations/getOrganizationOperations";
import { setOrganizationSignedController } from "../../../useCases/organizations/setOrganizationSigned";
import { createOrganizationShopController } from "../../../useCases/organizations/createOrganizationShop";
import { setOrganizationCashController } from "../../../useCases/organizations/setOrganizationCash";
import { setOrganizationPaymentTypeController } from "../../../useCases/organizations/setOrganizationPaymentType";
import { setOrganizationTipsController } from "../../../useCases/organizations/setOrganizationTips";
import '../../../useCases/organizationStatistics/updateOrganizationStatistics';
import { getOrganizationClientStatisticsController } from "../../../useCases/organizations/getOrganizationClientStatistics";
import { setOrganizationOnlineController } from "../../../useCases/organizations/setOrganizationOnline";
import { sendEnrollmentRequestController } from "../../../useCases/organizations/sendEnrollmentRequest";
import { getOrganizationFinancialReportController } from "../../../useCases/organizations/getOrganizationFinancialReport";
import { getOrganizationCitiesController } from "../../../useCases/organizations/getOrganizationCities";
import { getOrganizationDocumentsController } from "../../../useCases/organizations/getOrganizationDocuments";
import { requestPaymentTypeController } from "../../../useCases/organizations/requestPaymentType";
import { getDemoOrganizationJwtController } from "../../../useCases/organizations/getDemoOrganizationJwt";
import { configProps } from "../../../../../services/config";
import { setAddressCoordsController } from "../../../useCases/organizations/setAddressCoords";
import { getContactOrganizationsController } from "../../../useCases/organizations/getContactOrganizations";

const organizationRouter = Router();

organizationRouter.post('/create-organization', applyBlock, applyAuth, (req, res) => createOrganizationController.execute(req, res));
organizationRouter.put('/update-organization/:id', applyBlock, applyAuth, (req, res) => updateOrganizationController.execute(req, res)); 
organizationRouter.put('/subscribe-to-organization/:id', applyBlock, applyAuth, (req, res) => subscribeToOrganizationController.execute(req, res));
organizationRouter.put('/unsubscribe-from-organization/:id', applyBlock, applyAuth, (req, res) => unsubscribeFromOrganizationController.execute(req, res));
organizationRouter.get('/get-organization/:id', applyBlock, (req, res) => getOrganizationController.execute(req, res));
organizationRouter.get('/get-organization-by-invitation/:id', applyBlock, (req, res) => getOrganizationByInvitationController.execute(req, res));
organizationRouter.get('/find-organizations', applyBlock, applyAuth, (req, res) => findOrganizationsController.execute(req, res));
organizationRouter.get('/get-clients/:id', applyBlock, applyAuth, (req, res) => getOrganizationClientsController.execute(req, res));
organizationRouter.get('/get-client/:id', applyBlock, applyAuth, (req, res) => getOrganizationClientController.execute(req, res));
organizationRouter.get('/get-purchases/:id', applyBlock, (req, res) => getOrganizationPurchasesController.execute(req, res));
organizationRouter.get('/get-coupons/:id', applyBlock, (req, res) => getOrganizationCouponsController.execute(req, res));
organizationRouter.put('/set-manager/:id', applyBlock, applyAuth, (req, res) => setManagerController.execute(req, res));
organizationRouter.get('/get-employees/:id', applyBlock, applyAuth, (req, res) => getOrganizationEmployeesController.execute(req, res));
organizationRouter.get('/get-products/:id', applyBlock, (req, res) => getOrganizationProductsController.execute(req, res));
organizationRouter.put('/set-organization-disabled/:id', applyBlock, applyAuth, (req, res) => setOrganizationDisabledController.execute(req, res));
organizationRouter.get('/get-manager-organizations', applyBlock, applyAuth, (req, res) => getManagerOrganizationsController.execute(req, res));
organizationRouter.post('/send-document', applyBlock, applyAuth, (req, res) => sendDocumentsController.execute(req, res));
organizationRouter.get('/get-operations/:id', applyBlock, applyAuth, (req, res) => getOrganizationOperationsController.execute(req, res));
organizationRouter.put('/set-organization-signed/:id', applyBlock, applyAdminGuest, (req, res) => setOrganizationSignedController.execute(req, res));
organizationRouter.put('/create-organization-shop/:id', applyBlock, applyAuth, (req, res) => createOrganizationShopController.execute(req, res));
organizationRouter.put('/set-organization-cash/:id', applyBlock, applyAdminGuest, (req, res) => setOrganizationCashController.execute(req, res));
organizationRouter.put('/set-organization-payment-type/:id', applyBlock, applyAdminGuest, (req, res) => setOrganizationPaymentTypeController.execute(req, res));
organizationRouter.put('/set-organization-tips/:id', applyBlock, applyAdminGuest, (req, res) => setOrganizationTipsController.execute(req, res));
organizationRouter.get('/get-client-statistics/:id', applyBlock, applyAuth, (req, res) => getOrganizationClientStatisticsController.execute(req, res));
organizationRouter.put('/set-organization-online/:id', applyBlock, applyAdminGuest, (req, res) => setOrganizationOnlineController.execute(req, res));
organizationRouter.post('/send-enrollment-request', applyBlock, applyAuth, (req, res) => sendEnrollmentRequestController.execute(req, res));
organizationRouter.get('/get-organization-financial-report/:id', applyBlock, applyAuth, (req, res) => getOrganizationFinancialReportController.execute(req, res));
organizationRouter.get('/get-organization-cities', applyBlock, (req, res) => getOrganizationCitiesController.execute(req, res));
organizationRouter.get('/get-organization-documents/:id', applyBlock, applyAuth, (req, res) => getOrganizationDocumentsController.execute(req, res));
organizationRouter.post('/request-payment-type/:id', applyBlock, applyAuth, (req, res) => requestPaymentTypeController.execute(req, res));
if (configProps.demo) organizationRouter.get('/get-demo-organization-jwt', applyBlock, (req, res) => getDemoOrganizationJwtController.execute(req, res));
organizationRouter.put('/set-address-coords/:id', applyBlock, applyAuth, (req, res) => setAddressCoordsController.execute(req, res));
organizationRouter.get('/get-contact-organizations/:id', applyBlock, applyAuth, (req, res) => getContactOrganizationsController.execute(req, res));

export {
    organizationRouter
};

/*
[
    {   
        "name": "create organization",
        "path": "/organizations/create-organization",
        "dto": "src/app/modules/organizations/useCases/organizations/createOrganization/CreateOrganizationDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/createOrganization/createOrganizationErrors.ts",
        "method": "POST",
        "description": "Создаёт организацию."
    },
    {   
        "name": "get contact organizations",
        "path": "/organizations/get-contact-organizations/{contactId}?sortBy={string}&order={1 | -1}",
        "dto": "src/app/modules/organizations/useCases/organizations/getContactOrganizations/GetContactOrganizationsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/getContactOrganizations/getContactOrganizationsErrors.ts",
        "method": "GET",
        "description": "Получает организации контакта."
    },
    {   
        "name": "get demo organization jwt",
        "path": "/organizations/get-demo-organization-jwt",
        "dto": "src/app/modules/organizations/useCases/organizations/getDemoOrganizationJwt/GetDemoOrganizationJwtDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/getDemoOrganizationJwt/getDemoOrganizationJwtErrors.ts",
        "method": "GET",
        "description": "Создаёт демо организацию и возвращает JWT для входа."
    },
    {   
        "name": "get organization documents",
        "path": "/organizations/get-organization-documents/{id}",
        "dto": "src/app/modules/organizations/useCases/organizations/getOrganizationDocuments/GetOrganizationDocumentsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/getOrganizationDocuments/getOrganizationDocumentsErrors.ts",
        "method": "GET",
        "description": "Возвращает архив с документами организации."
    },
    {   
        "name": "request payment type",
        "path": "/organizations/request-payment-type/{id}",
        "dto": "src/app/modules/organizations/useCases/organizations/requestPaymentType/RequestPaymentTypeDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/requestPaymentType/requestPaymentTypeErrors.ts",
        "method": "POST",
        "description": "Запрос о смене терминала."
    },
    {   
        "name": "send enrollment request",
        "path": "/organizations/send-enrollment-request",
        "dto": "src/app/modules/organizations/useCases/organizations/sendEnrollmentRequest/SendEnrollmentRequestDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/sendEnrollmentRequest/sendEnrollmentRequestErrors.ts",
        "method": "POST",
        "description": "Присылает заявку на подключение."
    },
    {   
        "name": "create organization shop",
        "path": "/organizations/create-organization-shop/:id",
        "dto": "src/app/modules/organizations/useCases/organizations/createOrganizationShop/CreateOrganizationShopDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/createOrganizationShop/createOrganizationShopErrors.ts",
        "method": "PUT",
        "description": "Создаёт магазин в Тинькофф для организации."
    },
    {   
        "name": "send document",
        "path": "/organizations/send-document",
        "dto": "src/app/modules/organizations/useCases/organizations/sendDocuments/SendDocumentsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/sendDocuments/sendDocumentsErrors.ts",
        "method": "POST",
        "description": "Присылает документы на почту."
    },
    {   
        "name": "update organization",
        "path": "/organizations/update-organization/{id}",
        "dto": "src/app/modules/organizations/useCases/organizations/createOrganization/CreateOrganizationDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/createOrganization/createOrganizationErrors.ts",
        "method": "PUT",
        "description": "Обновляет организацию.",
        "tags": ["administration"]
    },
    {   
        "name": "set manager to organization",
        "path": "/organizations/set-manager/{id}",
        "dto": "src/app/modules/organizations/useCases/organizations/setManager/SetManagerDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/setManager/setManagerErrors.ts",
        "method": "PUT",
        "description": "Добавляет менеджера организации.",
        "tags": ["administration"]
    },
    {   
        "name": "subscribe to organization",
        "path": "/organizations/subscribe-to-organization/{id}",
        "dto": "src/app/modules/organizations/useCases/organizations/subscribeToOrganization/SubscribeToOrganizationDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/subscribeToOrganization/subscribeToOrganizationErrors.ts",
        "method": "PUT",
        "description": "Метод для подписки на организацию. Создаёт объект подписки (узел в реф. дереве) и добавляет пользователя в клиенты организации."
    },
    {   
        "name": "unsubscribe from organization",
        "path": "/organizations/unsubscribe-from-organization/{id}",
        "dto": "src/app/modules/organizations/useCases/organizations/unsubscribeFromOrganization/UnsubscribeFromOrganizationDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/unsubscribeFromOrganization/unsubscribeFromOrganizationErrors.ts",
        "method": "PUT",
        "description": "Метод для отписки от организации."
    },
    {   
        "name": "get organization",
        "path": "/organizations/get-organization/{id}",
        "dto": "src/app/modules/organizations/useCases/organizations/getOrganization/GetOrganizationDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/getOrganization/getOrganizationErrors.ts",
        "method": "GET"
    },
    {   
        "name": "get organization cities",
        "path": "/organizations/get-organization-cities",
        "dto": "src/app/modules/organizations/useCases/organizations/getOrganizationCities/GetOrganizationCitiesDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/getOrganizationCities/getOrganizationCitiesErrors.ts",
        "method": "GET",
        "description": "Возвращает список городов"
    },
    {   
        "name": "get organization by invitation id",
        "path": "/organizations/get-organization-by-invitation/{id}",
        "dto": "src/app/modules/organizations/useCases/organizations/getOrganizationByInvitation/GetOrganizationByInvitationDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/getOrganizationByInvitation/getOrganizationByInvitationErrors.ts",
        "method": "GET"
    },
    {   
        "name": "find organizations",
        "path": "/organizations/find-organizations?search={search}&limit={limit}&page={page}&inCity={1}",
        "dto": "src/app/modules/organizations/useCases/organizations/findOrganizations/FindOrganizationsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/findOrganizations/findOrganizationsErrors.ts",
        "method": "GET",
        "description": "Метод для поиска всех организаций по тегам, названию и категории."
    },
    {   
        "name": "get organization coupons",
        "path": "/organizations/get-coupons/{organizationId}?limit={limit}&page={page}&all={1}&type={type}",
        "dto": "src/app/modules/organizations/useCases/organizations/getOrganizationCoupons/GetOrganizationCouponsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/getOrganizationCoupons/getOrganizationCouponsErrors.ts",
        "method": "GET",
        "description": "Метод для поиска всех купонов организации.",
        "tags": ["administration"]
    },
    {   
        "name": "get organization operations",
        "path": "/organizations/get-operations/{organizationId}?limit={limit}&page={page}&dateFrom={iso}&dateTo={iso}",
        "dto": "src/app/modules/organizations/useCases/organizations/getOrganizationOperations/GetOrganizationOperationsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/getOrganizationOperations/getOrganizationOperationsErrors.ts",
        "method": "GET",
        "description": "Метод для поиска всех купонов организации.",
        "tags": ["administration"]
    },
    {   
        "name": "get organization employees",
        "path": "/organizations/get-employees/{organizationId}?limit={limit}&page={page}&role={cashier|manager}",
        "dto": "src/app/modules/organizations/useCases/organizations/getOrganizationEmployees/GetOrganizationEmployeesDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/getOrganizationEmployees/getOrganizationEmployeesErrors.ts",
        "method": "GET",
        "description": "Метод для поиска всех сотрудников организации.",
        "tags": ["administration"]
    },
    {   
        "name": "get organization clients",
        "path": "/organizations/get-clients/{organizationId}?limit={limit}&page={page}",
        "dto": "src/app/modules/organizations/useCases/organizations/getOrganizationClients/GetOrganizationClientsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/getOrganizationClients/getOrganizationClientsErrors.ts",
        "method": "GET",
        "description": "Метод для поиска всех клиентов организации.",
        "tags": ["administration"]
    },
    {   
        "name": "get organization products",
        "path": "/organizations/get-products/{organizationId}?limit={limit}&page={page}&type={'goods'|'service'}",
        "dto": "src/app/modules/organizations/useCases/organizations/getOrganizationProducts/GetOrganizationProductsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/getOrganizationProducts/getOrganizationProductsErrors.ts",
        "method": "GET",
        "description": "Метод для поиска все продукты организации.",
        "tags": ["administration"]
    },
    {   
        "name": "get organization client statistics",
        "path": "/organizations/get-client/{clientId}",
        "dto": "src/app/modules/organizations/useCases/organizations/getOrganizationClient/GetOrganizationClientDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/getOrganizationClient/getOrganizationClientErrors.ts",
        "method": "GET",
        "description": "Метод возвращает статистику клиента.",
        "tags": ["administration"]
    },
    {   
        "name": "get organization purchases",
        "path": "/organizations/get-purchases/{organizationId}?limit={limit}&page={page}&cashierContactId={id}",
        "dto": "src/app/modules/organizations/useCases/organizations/getOrganizationPurchases/GetOrganizationPurchasesDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/getOrganizationPurchases/getOrganizationPurchasesErrors.ts",
        "method": "GET",
        "description": "Метод для поиска всех операций организации.",
        "tags": ["administration"]
    },
    {   
        "name": "set organization disabled",
        "path": "/organizations/set-organization-disabled/{organizationId}",
        "dto": "src/app/modules/organizations/useCases/organizations/setOrganizationDisabled/SetOrganizationDisabledDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/setOrganizationDisabled/setOrganizationDisabledErrors.ts",
        "method": "PUT",
        "description": "Метод для переключения статуса организации.",
        "tags": ["administration"]
    },
    {   
        "name": "set organization payment type",
        "path": "/organizations/set-organization-payment-type/{organizationId}",
        "dto": "src/app/modules/organizations/useCases/organizations/setOrganizationPaymentType/SetOrganizationPaymentTypeDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/setOrganizationPaymentType/setOrganizationPaymentTypeErrors.ts",
        "method": "PUT",
        "description": "Метод для переключения терминала организации.",
        "tags": ["administration"]
    },
    {   
        "name": "set organization signed",
        "path": "/organizations/set-organization-signed/{organizationId}",
        "dto": "src/app/modules/organizations/useCases/organizations/setOrganizationDisabled/SetOrganizationDisabledDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/setOrganizationDisabled/setOrganizationDisabledErrors.ts",
        "method": "PUT",
        "description": "Метод для переключения статуса организации.",
        "tags": ["administration"]
    },
    {   
        "name": "get manager organizations",
        "path": "/organizations/get-manager-organizations",
        "dto": "src/app/modules/organizations/useCases/organizations/getManagerOrganizations/GetManagerOrganizationsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/getManagerOrganizations/getManagerOrganizationsErrors.ts",
        "method": "GET",
        "description": "Возвращает организации менеджера и токены для них."
    },
    {   
        "name": "Set organization cash",
        "path": "/organizations/set-organization-cash/{organizationId}",
        "dto": "src/app/modules/organizations/useCases/organizations/setOrganizationCash/SetOrganizationCashDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/setOrganizationCash/setOrganizationCashErrors.ts",
        "method": "PUT",
        "description": "Включает/выключает наличные платежи для организации."
    },
    {   
        "name": "Set organization online",
        "path": "/organizations/set-organization-online/{organizationId}",
        "dto": "src/app/modules/organizations/useCases/organizations/setOrganizationOnline/SetOrganizationOnlineDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/setOrganizationOnline/setOrganizationOnlineErrors.ts",
        "method": "PUT",
        "description": "Включает/выключает онлайн платежи для организации."
    },
    {
        "name": "Set organization tips",
        "path": "/organizations/set-organization-tips/{organizationId}",
        "dto": "src/app/modules/organizations/useCases/organizations/setOrganizationTips/SetOrganizationTipsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/setOrganizationTips/setOrganizationTipsErrors.ts",
        "method": "PUT",
        "description": "Включает/выключает чаевые для организации."
    },
    {
        "name": "get organization client statistics",
        "path": "/organizations/get-client-statistics/{organizationId}",
        "dto": "src/app/modules/organizations/useCases/organizations/getOrganizationClientStatistics/GetOrganizationClientStatisticsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/getOrganizationClientStatistics/getOrganizationClientStatisticsErrors.ts",
        "method": "GET",
        "description": "Включает/выключает чаевые для организации."
    },
    {
        "name": "get organization financial report",
        "path": "/organizations/get-organization-financial-report/{organizationId}",
        "dto": "src/app/modules/organizations/useCases/organizations/getOrganizationFinancialReport/GetOrganizationFinancialReportDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/getOrganizationFinancialReport/getOrganizationFinancialReportErrors.ts",
        "method": "GET",
        "description": "Генерирует фин отчет за период organization.lastFinancialReport."
    },
    {
        "name": "set address coords",
        "path": "/organizations/set-address-coords/{organizationId}",
        "dto": "src/app/modules/organizations/useCases/organizations/setAddressCoords/SetAddressCoordsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizations/setAddressCoords/setAddressCoordsErrors.ts",
        "method": "PUT",
        "description": "Установить координаты вручную."
    }
]
*/