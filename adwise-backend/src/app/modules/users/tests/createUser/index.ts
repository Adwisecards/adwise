// import { Result } from "../../../../core/models/Result";
// import { userRepo } from "../../repo/users";
// import { createUserUseCase } from "../../useCases/users/createUser";

// async function createUserTest() {
//     const phone = '79915144011';
//     const firstName = 'Miguel';
//     const password = '12345678qwe';

//     const userCreated = await createUserUseCase.execute({
//         phone: phone,
//         firstName: firstName,
//         password: password,
//         dob: undefined as any,
//         email: undefined as any,
//         gender: undefined as any,
//         lastName: undefined as any,
//         noCheck: undefined as any,
//         noVerification: undefined as any,
//         organizationUser: undefined as any,
//         parentRefCode: undefined as any,
//         deviceToken: undefined as any,
//         pictureMediaId: undefined as any,
//         pushToken: undefined as any
//     });

//     if (userCreated.isFailure) {
//         return new Error('Error upon creating user');
//     }

//     const { userId } = userCreated.getValue()!;

//     const userFound = await userRepo.findById(userId);
//     if (userFound.isFailure) {
//         return new Error('Error upon finding user');
//     }

//     const user = userFound.getValue()!;

//     if (user.firstName != firstName) {
//         return new Error('User first name is not correct');
//     }

//     if (user.phone != phone) {
//         return new Error('User phone is not correct');
//     } 

//     const passwordCorrect = await user.comparePassword(password);
//     if (!passwordCorrect) {
//         return new Error('User password is not correct');
//     }

//     if (!user.contacts.length) {
//         return new Error('User contacts is empty');
//     }

//     const contactFound = await contactFound
// };