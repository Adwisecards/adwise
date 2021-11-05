import { receiverGroupRepo } from '../../../../notification/repo/receiverGroups';
import { administrationValidationService } from '../../../services/administrationValidationService';
import { FindAllReceiverGroupsController } from './FindAllReceiverGroupsController';
import { FindAllReceiverGroupsUseCase } from './FindAllReceiverGroupsUseCase';

export const findAllReceiverGroupsUseCase = new FindAllReceiverGroupsUseCase(
    receiverGroupRepo,
    administrationValidationService
);

export const findAllReceiverGroupsController = new FindAllReceiverGroupsController(findAllReceiverGroupsUseCase);