import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { createContactController } from "../../../useCases/contacts/createContact";
import { deleteContactController } from "../../../useCases/contacts/deleteContact";
import { findContactsController } from "../../../useCases/contacts/findContacts";
import { getContactController } from "../../../useCases/contacts/getContact";
import { getContactsController } from "../../../useCases/contacts/getContacts";
import { updateContactController } from "../../../useCases/contacts/updateContact";

const contactRouter = Router();

contactRouter.post('/create-contact', applyBlock, applyAuth, (req, res) => createContactController.execute(req, res));
contactRouter.get('/get-contact/:id', applyBlock, (req, res) => getContactController.execute(req, res));
contactRouter.delete('/delete-contact/:id', applyBlock, applyAuth, (req, res) => deleteContactController.execute(req, res));
contactRouter.put('/update-contact/:id', applyBlock, applyAuth, (req, res) => updateContactController.execute(req, res));
contactRouter.post('/get-contacts', applyBlock, applyAuth, (req, res) => getContactsController.execute(req, res));
contactRouter.get('/find-contacts', applyBlock, applyAuth, (req, res) => findContactsController.execute(req, res));

export {
    contactRouter
};

/*
[
    {   
        "name": "create contact",
        "path": "/contacts/create-contact",
        "dto": "src/app/modules/contacts/useCases/contacts/createContact/CreateContactDTO.ts",
        "errors": "src/app/modules/contacts/useCases/contacts/createContact/createContactErrors.ts",
        "method": "POST",
        "description": "Метод создает визитку пользователя и добавляет ссылку на неё в объект пользователя."
    },
    {   
        "name": "get contact",
        "path": "/contacts/get-contact/{id}",
        "dto": "src/app/modules/contacts/useCases/contacts/getContact/GetContactDTO.ts",
        "errors": "src/app/modules/contacts/useCases/contacts/getContact/getContactErrors.ts",
        "method": "GET"
    },
    {   
        "name": "delete contact",
        "path": "/contacts/delete-contact/{id}",
        "dto": "src/app/modules/contacts/useCases/contacts/deleteContact/DeleteContactDTO.ts",
        "errors": "src/app/modules/contacts/useCases/contacts/deleteContact/deleteContactErrors.ts",
        "method": "DELETE",
        "description": "Метод удаляет визитку пользователя, если она существует."
    },
    {   
        "name": "update contact",
        "path": "/contacts/update-contact/{contactId}",
        "dto": "src/app/modules/contacts/useCases/contacts/updateContact/UpdateContactDTO.ts",
        "errors": "src/app/modules/contacts/useCases/contacts/updateContact/updateContactErrors.ts",
        "method": "PUT",
        "description": "Метод обновляет визитку пользователя.",
        "tags": ["administration"]
    },
    {   
        "name": "get contacts",
        "path": "/contacts/get-contacts",
        "dto": "src/app/modules/contacts/useCases/contacts/getContacts/GetContactsDTO.ts",
        "errors": "src/app/modules/contacts/useCases/contacts/getContacts/getContactsErrors.ts",
        "method": "POST",
        "description": "Метод принимает массив контактов телефонной книги и находит визитки по номеру и эл. почте в базе данных."
    },
    {   
        "name": "find contacts",
        "path": "/contacts/find-contacts?limit={limit}&page={page}",
        "dto": "src/app/modules/contacts/useCases/contacts/getContacts/GetContactsDTO.ts",
        "errors": "src/app/modules/contacts/useCases/contacts/getContacts/getContactsErrors.ts",
        "method": "POST",
        "description": "Метод принимает массив контактов телефонной книги и находит визитки по номеру и эл. почте в базе данных."
    }
]
*/