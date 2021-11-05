import { IWisewinCheckTokenResponse, IWisewinService, IWisewinUser } from "../IWisewinService";
import * as axios from 'axios';
import { Result } from "../../../core/models/Result";

export class WisewinService implements IWisewinService {
    private transport: axios.AxiosInstance;

    constructor(baseUrl: string) {
        this.transport = this.configureTransport(baseUrl);
    }

    public async getUser(id: string): Promise<Result<IWisewinUser | null, Error | null>> {
        try {
            const {data} = await this.transport.get('/auth/user-info?id='+id);
            if (data.success) {
                return Result.ok(this.parseUserData(data));
            } else {
                if (data.message == 'User not found') {
                    return Result.fail(new Error('Not found'));
                } else {
                    return Result.fail(new Error('Problem in process'));
                }
            }
        } catch (ex) {
            return Result.fail(ex);
        }
    }

    public async getUsersById(ids: string[]): Promise<Result<IWisewinUser[] | null, Error | null>> {
        try {
            const {data} = await this.transport.post('/auth/users-info', ids);
            const users: IWisewinUser[] = data;
            for (const userIndex in users) {
                users[userIndex] = this.parseUserData(users[userIndex]);
            }
            
            return Result.ok(users);
            
        } catch (ex) {
            console.log(123123123, ex);
            return Result.fail(ex);
        }
    }

    public async getUserByPhone(phone: string): Promise<Result<IWisewinUser | null, Error | null>> {
        try {
            const {data} = await this.transport.get('/auth/user-info?phone='+phone);
            if (data.success) {
                return Result.ok(this.parseUserData(data));
            } else {
                if (data.message == 'User not found') {
                    return Result.fail(new Error('Not found'));
                } else {
                    return Result.fail(new Error('Problem in process'));
                }
            }
        } catch (ex) {
            return Result.fail(ex);
        }
    }

    public async getUserByEmail(email: string): Promise<Result<IWisewinUser | null, Error | null>> {
        try {
            const {data} = await this.transport.get('/auth/user-info?email='+email);
            if (data.success) {
                return Result.ok(this.parseUserData(data));
            } else {
                if (data.message == 'User not found') {
                    return Result.fail(new Error('Not found'));
                } else {
                    return Result.fail(new Error('Problem in process'));
                }
            }
        } catch (ex) {
            return Result.fail(ex);
        }
    }

    public async checkAuthToken(token: string, ip: string): Promise<Result<IWisewinCheckTokenResponse | null, Error | null>> {
        try {
            const {data} = await this.transport.get(`/auth/check-token?token=${token}&ip=${ip}`);
            if (data.success) {
                return Result.ok({
                    success: data.success,
                    userId: data.user_id
                });
            } else {
                if (data.message == 'User not found') {
                    return Result.fail(new Error('Not found'));
                } else {
                    return Result.fail(new Error('Problem in process'));
                }
            }
        } catch (ex) {
            return Result.fail(ex);
        }
    }

    private parseUserData(data: any): IWisewinUser {
        return {
            dob: data.dob ? new Date(data.dob) : new Date(),
            email: data.email || '',
            firstName: data.first_name || '',
            id: data.user_id || '',
            lastModified: data.user_last_modified_timestamp ? new Date(data.user_last_modified_timestamp) : new Date(),
            lastName: data.last_name || '',
            phone: data.phone || '',
            picture: data.avatar || '',
            gender: data.gender || 'other',
            packageReferrerPercent: data.package_referrer_percent || 0,
            packageRewardLimit: data.package_reward_limit || 0,
            startPackagesLeft: data.start_packages_left || 0,
            parentId: data.parent_id || '',
            tariffTitle: data.tariff_title || ''
        };
    }

    private configureTransport(baseUrl: string): axios.AxiosInstance {
        return axios.default.create({
            baseURL: baseUrl,
            withCredentials: true
        });
    }
}