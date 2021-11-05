import { Router } from "express";
import { applyAdmin, applyDecode } from "../../../../services/server/implementation/middleware/middlewares";
import { createLogController } from "../../useCases/createLog";
import { getSystemLogFileController } from "../../useCases/getSystemLogFile";
import { getSystemLogFilenamesController } from "../../useCases/getSystemLogFilenames";

export const logRouter = Router();

logRouter.post('/create-log', applyDecode, (req, res) => createLogController.execute(req, res));
logRouter.get('/get-system-log-filenames', (req, res) => getSystemLogFilenamesController.execute(req, res));
logRouter.get('/get-system-log-file/:filename', (req, res) => getSystemLogFileController.execute(req, res));

/*
[
    {   
        "name": "create log",
        "path": "/logs/create-log",
        "dto": "src/app/modules/logs/useCases/createLog/CreateLogDTO.ts",
        "errors": "src/app/modules/logs/useCases/createLog/createLogErrors.ts",
        "method": "POST",
        "description": "Создаёт лог."
    },
    {
        "name": "get system log filenames",
        "path": "/logs/get-system-log-filenames",
        "dto": "src/app/modules/logs/useCases/getSystemLogFilenames/GetSystemLogFilenamesDTO.ts",
        "errors": "src/app/modules/logs/useCases/getSystemLogFilenames/getSystemLogFilenamesErrors.ts",
        "method": "GET",
        "description": "Возвращает названия файлов системных логов."
    },
    {
        "name": "get system log filenames",
        "path": "/logs/get-system-log-file/{filename}",
        "dto": "src/app/modules/logs/useCases/getSystemLogFile/GetSystemLogFileDTO.ts",
        "errors": "src/app/modules/logs/useCases/getSystemLogFile/getSystemLogFileErrors.ts",
        "method": "GET",
        "description": "Возвращает содержание файла системных логов."
    }
]
*/