import { logger } from '../../../../services/logger';
import { GetSystemLogFilenamesController } from './GetSystemLogFilenamesController';
import { GetSystemLogFilenamesUseCase } from './GetSystemLogFilenamesUseCase';

export const getSystemLogFilenamesUseCase = new GetSystemLogFilenamesUseCase(logger);
export const getSystemLogFilenamesController = new GetSystemLogFilenamesController(getSystemLogFilenamesUseCase);