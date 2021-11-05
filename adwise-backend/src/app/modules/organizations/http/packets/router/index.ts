import { Router } from "express";
import { applyAdmin, applyAdminGuest, applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { addPacketToOrganizationController } from "../../../useCases/packets/addPacketToOrganization";
import { chooseWisewinOptionPacketController } from "../../../useCases/packets/chooseWisewinOptionPacket";
import { createPacketController } from "../../../useCases/packets/createPacket";
import { deletePacketController } from "../../../useCases/packets/deletePacket";
import { disablePacketController } from "../../../useCases/packets/disablePacket";
import { getPacketsController } from "../../../useCases/packets/getPackets";
import { getWisewinOptionPacketsController } from "../../../useCases/packets/getWisewinOptionPackets";
import { requestPacketController } from "../../../useCases/packets/requestPacket";
import { setOrganizationPacketController } from "../../../useCases/packets/setOrganizationPacket";
import { setPacketDefaultController } from "../../../useCases/packets/setPacketDefault";
import { updatePacketController } from "../../../useCases/packets/updatePacket";

const packetRouter = Router();

packetRouter.post('/create-packet', applyAdmin, (req, res) => createPacketController.execute(req, res));
packetRouter.delete('/delete-packet/:id', applyAdmin, (req, res) => deletePacketController.execute(req, res));
packetRouter.get('/get-packets', (req, res) => getPacketsController.execute(req, res));
packetRouter.put('/add-packet-to-organization', applyAuth, applyAdminGuest, (req, res) => addPacketToOrganizationController.execute(req, res));
packetRouter.put('/set-organization-packet/:id', applyAdminGuest, (req, res) => setOrganizationPacketController.execute(req, res));
packetRouter.post('/request-packet', applyBlock, applyAuth, (req, res) => requestPacketController.execute(req, res));
packetRouter.put('/set-packet-disabled/:id', applyAdmin, (req, res) => disablePacketController.execute(req, res));
// packetRouter.put('/set-packet-default/:id', applyAdmin, (req, res) => setPacketDefaultController.execute(req, res));
packetRouter.put('/update-packet/:id', applyAdmin, (req, res) => updatePacketController.execute(req, res));
packetRouter.get('/get-wisewin-option-packets', (req, res) => getWisewinOptionPacketsController.execute(req, res));
packetRouter.put('/choose-wisewin-option-packet/:id', applyAuth, (req, res) => chooseWisewinOptionPacketController.execute(req, res));

export {
    packetRouter
};

/*
[
    {   
        "name": "create packet",
        "path": "/organizations/create-packet",
        "dto": "src/app/modules/organizations/useCases/packets/createPacket/CreatePacketDTO.ts",
        "errors": "src/app/modules/organizations/useCases/packets/createPacket/createPacketErrors.ts",
        "method": "POST",
        "description": "Создаёт пакет.",
        "tags": ["administration"]
    },
    {   
        "name": "update packet",
        "path": "/organizations/update-packet/{id}",
        "dto": "src/app/modules/organizations/useCases/packets/updatePacket/UpdatePacketDTO.ts",
        "errors": "src/app/modules/organizations/useCases/packets/updatePacket/updatePacketErrors.ts",
        "method": "PUT",
        "description": "Обновляет пакет.",
        "tags": ["administration"]
    },
    {   
        "name": "request packet",
        "path": "/organizations/request-packet",
        "dto": "src/app/modules/organizations/useCases/packets/requestPacket/RequestPacketDTO.ts",
        "errors": "src/app/modules/organizations/useCases/packets/requestPacket/requestPacketErrors.ts",
        "method": "POST",
        "description": "создаёт запрос на покупку пакет.",
        "tags": ["administration"]
    },
    {   
        "name": "get packets",
        "path": "/organizations/get-packets",
        "dto": "src/app/modules/organizations/useCases/packets/getPackets/GetPacketsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/packets/getPackets/getPacketsErrors.ts",
        "method": "GET",
        "description": "Возвращает доступные пакеты."
    },
    {   
        "name": "delete packet",
        "path": "/organizations/delete-packet/{packetId}",
        "dto": "src/app/modules/organizations/useCases/packets/deletePacket/DeletePacketDTO.ts",
        "errors": "src/app/modules/organizations/useCases/packets/deletePacket/deletePacketErrors.ts",
        "method": "DELETE",
        "description": "Удаляет пакет."
    },
    {
        "name": "add packet to organization",
        "path": "/organizations/add-packet-to-organization",
        "dto": "src/app/modules/organizations/useCases/packets/addPacketToOrganization/AddPacketToOrganizationDTO.ts",
        "errors": "src/app/modules/organizations/useCases/packets/addPacketToOrganization/addPacketToOrganizationErrors.ts",
        "method": "PUT",
        "description": "Добавляет пакет к организации."
    },
    {
        "name": "set packet disabled",
        "path": "/organizations/set-packet-disabled/{packetId}",
        "dto": "src/app/modules/organizations/useCases/packets/disablePacket/DisablePacketDTO.ts",
        "errors": "src/app/modules/organizations/useCases/packets/disablePacket/disablePacketErrors.ts",
        "method": "PUT",
        "description": "Отключает пакет."
    },
    {
        "name": "set packet to organization",
        "path": "/organizations/set-organization-packet/{organizationId}",
        "dto": "src/app/modules/organizations/useCases/packets/setOrganizationPacket/SetOrganizationPacketDTO.ts",
        "errors": "src/app/modules/organizations/useCases/packets/setOrganizationPacket/setOrganizationPacketErrors.ts",
        "method": "PUT",
        "description": "Добавляет пакет к организации."
    },
    {
        "name": "set packet default",
        "path": "/organizations/set-packet-default/{packetId}",
        "dto": "src/app/modules/organizations/useCases/packets/setPacketDefault/SetPacketDefaultDTO.ts",
        "errors": "src/app/modules/organizations/useCases/packets/setPacketDefault/setPacketDefaultErrors.ts",
        "method": "PUT",
        "description": "Устанавливает пакет как стандартный."
    },
    {
        "name": "get wisewin option packets",
        "path": "/organizations/get-wisewin-option-packets",
        "dto": "src/app/modules/organizations/useCases/packets/getWisewinOptionPackets/GetWisewinOptionPacketsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/packets/getWisewinOptionPackets/getWisewinOptionPacketsErrors.ts",
        "method": "GET",
        "description": "Получить все пакеты на выбор для вайсвин менеджера."
    },
    {
        "name": "choose wisewin option packet",
        "path": "/organizations/choose-wisewin-option-packet/{packetId}",
        "dto": "src/app/modules/organizations/useCases/packets/chooseWisewinOptionPacket/ChooseWisewinOptionPacketDTO.ts",
        "errors": "src/app/modules/organizations/useCases/packets/chooseWisewinOptionPacket/chooseWisewinOptionPacketErrors.ts",
        "method": "PUT",
        "description": "Выбрать пакет для вайсвин менеджера."
    }
]
*/