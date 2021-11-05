import { emailService } from '../../../../../services/emailService';
import { smsService } from '../../../../../services/smsService';
import { userRepo } from '../../../repo/users';
import { verificationRepo } from '../../../repo/verifications';
import {CreateVerificationUseCase} from './CreateVerificationUseCase';

const createVerificationUseCase = new CreateVerificationUseCase(verificationRepo, userRepo, emailService, smsService);

export {
    createVerificationUseCase
};