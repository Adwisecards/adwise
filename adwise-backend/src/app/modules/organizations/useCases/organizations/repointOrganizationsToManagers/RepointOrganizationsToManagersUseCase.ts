import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { RepointOrganizationsToManagersDTO } from "./RepointOrganizationsToManagersDTO";
import { repointOrganizationsToManagersErrors } from "./repointOrganizationsToManagersErrors";

export class RepointOrganizationsToManagersUseCase implements IUseCase<RepointOrganizationsToManagersDTO.Request, RepointOrganizationsToManagersDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    private userRepo: IUserRepo;

    public errors = repointOrganizationsToManagersErrors;

    constructor(organizationRepo: IOrganizationRepo, userRepo: IUserRepo) {
        this.organizationRepo = organizationRepo;
        this.userRepo = userRepo;
    }

    public async execute(_: RepointOrganizationsToManagersDTO.Request): Promise<RepointOrganizationsToManagersDTO.Response> {
        return Result.ok({ids: await this.setOrganizationManagers() as any});
        
        const organizationsFound = await this.organizationRepo.getAll();
        if (organizationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organizations'));
        }

        const organizations = organizationsFound.getValue()!;

        const organizationsWithManagers = organizations.filter(o => o.manager);

        const ids: string[] = [];

        for (const organization of organizationsWithManagers) {
            const organizationManagerFound = await this.userRepo.findById(organization.manager.toString());
            if (organizationManagerFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding manager'));
            }

            const organizationManager = organizationManagerFound.getValue()!;

            if (!organizationManager.emailInfo) continue;

            const crmManagerFound = await this.userRepo.findByEmail(organizationManager.emailInfo);
            if (crmManagerFound.isFailure) {
                console.log(organization._id, organizationManager._id, organizationManager.emailInfo);
                return Result.fail(UseCaseError.create('a', 'Error upon finding crm manager'));
            }

            const crmManager = crmManagerFound.getValue()!;

            organization.manager = crmManager._id;

            const organizationSaved = await this.organizationRepo.save(organization);
            if (organizationSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
            }

            ids.push(organization._id);
        }

        return Result.ok({ids});
    }

    private async getOrganizationManagerMap(): Promise<{[key: string]: string} | undefined> {
        const organizationsFound = await this.organizationRepo.getAll();
        if (organizationsFound.isFailure) {
            return;
        }

        const organizations = organizationsFound.getValue()!;

        const organizationsWithManagers = organizations.filter(o => o.manager);

        const map: {[key: string]: string} = {};

        for (const organization of organizationsWithManagers) {
            map[organization._id.toString()] = organization.manager.toString();
        }

        return map;
    }

    private async setOrganizationManagers() {
        const organizationManagers = {
            '5fc159351da4ab00284478c4': '5fec8852820fa57bfc960058',
            '5fc159871da4ab0028447913': '5fec8852820fa57bfc960058',
            '5fc18a659a18040028eb6337': '5fc187989a18040028eb62e1',
            '5fc203cb0e48580028eca14e': '5fc1587196855a00285fad65',
            '5fc492689d902b0028dd693a': '5fec8850820fa57bfc960040',
            '5fc4a3b19d902b0028dd736e': '5fc22b778d84d6002784416d',
            '5fc4a4af9d902b0028dd7392': '5fc22b778d84d60027844163',
            '5fc4ee38c288450028614423': '5fec8850820fa57bfc960040',
            '5fc54bd4a42eb400279206d9': '5fec8850820fa57bfc960040',
            '5fc5e4f8a42eb400279215ee': '5fec8857820fa57bfc96029d',
            '5fc655bfc9c85f0027c6b603': '5fec8857820fa57bfc96029d',
            '5fc65751c9c85f0027c6b6a6': '5fc23fb09d902b0028dc3530',
            '5fc67f8dc9c85f0027c6efc2': '5fc23b639d902b0028dc337c',
            '5fc739ddc9c85f0027c720cc': '5fec8857820fa57bfc96029d',
            '5fc75bbac9c85f0027c7298e': '5fc237b79d902b0028dc31f4',
            '5fc75e3dc9c85f0027c72a67': '5fc237663630030027755fc8',
            '5fc75e70c9c85f0027c72abb': '5fc237b79d902b0028dc31f4',
            '5fc760e4c9c85f0027c72b6d': '5fc23af99d902b0028dc332c',
            '5fc786dec9c85f0027c7567e': '5fc162251da4ab0028447f38',
            '5fc7f639c9c85f0027c797b6': '5fc237673630030027755fd2',
            '5fc800e6c9c85f0027c79c0a': '5fc1fbad0e48580028ec9e2c',
            '5fc85796c6952e00281678c0': '5fc23f249d902b0028dc3452',
            '5fc8d1eadb954600270148a8': '5fc23fea9d902b0028dc3647',
            '5fc8ee47a318000027ea078f': '5fec8878820fa57bfc960ebe',
            '5fc8f2e1a318000027ea0b8c': '5fc5e15aa42eb4002792155e',
            '5fc9feb726f47300274bf332': '5fec946655e77681bdd64cf1',
            '5fca2a1abde3420028777420': '5fec8850820fa57bfc960040',
            '5fcb4eba884138002869573c': '5fc22b778d84d60027844163',
            '5fcb64288841380028696a30': '5fc23b67363003002775605b',
            '5fcc98e39676f100288a3520': '5fec886b820fa57bfc960a4b',
            '5fcccb499676f100288a72a7': '5fc235163630030027755faa',
            '5fcccb6d9676f100288a72fb': '5fca58b5669e65002738a9fd',
            '5fce34a972b5ac00280355c1': '5fc64875c9c85f0027c6b2cc',
            '5fcf648c2f48bf0027aacfc5': '5fec88a1820fa57bfc9623af',
            '5fcf6fcb2f48bf0027ab0f6a': '5fec88a1820fa57bfc9623af',
            '5fd09d7cd56a3b002730b16e': '5fc237b79d902b0028dc31f4',
            '5fd0c92cd56a3b00273113a7': '5fec8863820fa57bfc96042a',
            '5fd0cf37d56a3b0027311e45': '5fec8875820fa57bfc960e38',
            '5fd0dc6620980700270fef71': '5fc23f249d902b0028dc3452',
            '5fd38b777c57780028b513c7': '5fec88c2820fa57bfc962ed3',
            '5fd3d07f7c57780028b53d11': '5fec885f820fa57bfc960404',
            '5fd3d9947c57780028b53e84': '5fec885f820fa57bfc960404',
            '5fd78756810eda002827b316': '5fd784a8810eda002827b019',
            '5fde0a0e58e5d20027b47a91': '5fc235163630030027755faa',
            '5fe1e9982372a900288f4b71': '5fe1d716da86840029a2641c',
            '5fe2f04fda61250027f10554': '5fc23b639d902b0028dc3386',
            '5fe2f661da61250027f2c212': '5fc1587196855a00285fad65',
            '5fe31110da61250027faef34': '5fc1587196855a00285fad65',
            '5fe41d6aeca9dd00281a6d4a': '5fec8857820fa57bfc96029d',
            '5ff457e9db14e40012ed59c5': '5fc1587196855a00285fad65',
            '5ffbfcb50d946f00118a4dbf': '5fc22b778d84d60027844163'
        };

        const organizationsFound = await this.organizationRepo.getAll();
        if (organizationsFound.isFailure) {
            return;
        }

        const organizations = organizationsFound.getValue()!;

        const organizationsWithManagers = organizations.filter(o => o.manager)

        for (const organization of organizationsWithManagers) {           
            const managerId = (<any>organizationManagers)[organization._id.toString()];
            
            if (managerId) {
                organization.manager = managerId;
                const organizationSaved = await this.organizationRepo.save(organization);
                if (organizationSaved.isFailure) {
                    console.log(organizationSaved.getError());
                }
            }
        }

        return JSON.stringify({});
    }
}