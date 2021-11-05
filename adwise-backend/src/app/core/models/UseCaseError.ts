type code = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' |
            'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | '1' | '2' | '3' | '4' | '5' | '6' |
            '7' | '8' | '9' | 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6' | 'a7' | 'a8' | 'a9' | 'a0' | 'b1' | 'b2' |
            'b3' | 'b4';

// UseCaseError is a class that implements every error for use case in this application
export class UseCaseError extends Error {
    public code: string;
    public HTTPStatus: number;
    public details: string;

    private static readonly errors: {[code: string]: UseCaseError} = {
        a: new UseCaseError('Problem occured in process', 'a', 500),
        b: new UseCaseError('Not found', 'b', 404),
        c: new UseCaseError('Provided data is not valid', 'c', 400),
        d: new UseCaseError('Access is forbidden', 'd', 403),
        e: new UseCaseError('Unauthenticated', 'e', 401),
        f: new UseCaseError('Conflict', 'f', 409),
        g: new UseCaseError('User with login does not exist', 'g', 400),
        h: new UseCaseError('Password is not correct', 'h', 400),
        i: new UseCaseError('Code is not correct', 'i', 400),
        j: new UseCaseError('Category does not exist', 'j', 400),
        k: new UseCaseError('Restoration is not confirmed', 'k', 400),
        l: new UseCaseError('Organization does not exist', 'l', 400),
        m: new UseCaseError('User does not exist', 'm', 400),
        n: new UseCaseError('Subscription does not exist', 'n', 400),
        o: new UseCaseError('Invitation does not exist', 'o', 400),
        p: new UseCaseError('Offer does not exist', 'p', 400),
        q: new UseCaseError('Coupon does not exist', 'q', 400),
        r: new UseCaseError('Wallet does not exist', 'r', 400),
        s: new UseCaseError('Purchase does not exist', 's', 400),
        t: new UseCaseError('Not enough points in wallet', 't', 400),
        u: new UseCaseError('Purchase is already confirmed', 'u', 400),
        v: new UseCaseError('Coupon quantity is 0', 'v', 400),
        w: new UseCaseError('Contact does not exist', 'w', 400),
        x: new UseCaseError('Employee does not exist', 'x', 400),
        y: new UseCaseError('Packet does not exist', 'y', 400),
        z: new UseCaseError('Packet limit on employees is reached', 'z', 400),
        '1': new UseCaseError('Packet limit on coupons is reached', '1', 400),
        '2': new UseCaseError('Product does not exist', '2', 400),
        '3': new UseCaseError('Withdrawal request does not exist', '3', 400),
        '4': new UseCaseError('Payment does not exist', '4', 400),
        '5': new UseCaseError('Retry later', '5', 429),
        '6': new UseCaseError('Tips do not exist', '6', 400),
        '7': new UseCaseError('Accumulation does not exist', '7', 400),
        '8': new UseCaseError('Receiver group does not exist', '8', 400),
        '9': new UseCaseError('Question category does not exist', '9', 400),
        'a1': new UseCaseError('Question does not exist', 'a1', 400),
        'a2': new UseCaseError('Version does not exist', 'a2', 400),
        'a3': new UseCaseError('Legal info request does not exist', 'a3', 400),
        'a4': new UseCaseError('Chat does not exist', 'a4', 400),
        'a5': new UseCaseError('Media does not exist', 'a5', 400),
        'a6': new UseCaseError('Advantage does not exist', 'a6', 400),
        'a7': new UseCaseError('Partner does not exist', 'a7', 400),
        'a8': new UseCaseError('Employee rating does not exist', 'a8', 400),
        'a9': new UseCaseError('Address does not exist', 'a9', 400),
        'a0': new UseCaseError('Verification does not exist', 'a0', 400),
        'b1': new UseCaseError('Document does not exist', 'b1', 400),
        'b2': new UseCaseError('Coupon category does not exist', 'b2', 400),
        'b3': new UseCaseError('Organization document does not exist', 'b3', 400),
        'b4': new UseCaseError('Legal does not exist', 'b4', 400)
    };

    private constructor(message: string, code: string, HTTPStatus: number, details?: string) {
        super(message);
        this.code = code;
        this.HTTPStatus = HTTPStatus;
        this.details = details || '';
    }

    /**
     * 
     *@see a: Problem occured in process
     *@see b: Not found
     *@see c: Provided data is not valid
     *@see d: Access is forbidden
     *@see e: Unauthenticated
     *@see f: Conflict
     *@see g: User with login does not exist
     *@see h: Password is not correct
     *@see i: Code is not correct
     *@see j: Category does not exist
     *@see k: Restoration is not confirmed
     *@see l: Organization does not exist
     *@see m: User does not exist
     *@see n: Subscription does not exist
     *@see o: Invitation does not exist
     *@see p: Offer does not exist
     *@see q: Coupon does not exist
     *@see r: Wallet does not exist
     *@see s: Purchase does not exist
     *@see t: Not enough points in wallet
     *@see u: Purchase is already confirmed
     *@see v: Coupon quantity is 0
     *@see w: Contact does not exist
     *@see x: Employee does not exist
     *@see y: Packet does not exist
     *@see z: Packet's limit on employees is reached
     *@see 1: Packet's limit on coupons is reached
     *@see 2: Product does not exist
     *@see 3: Withdrawal request does not exist
     *@see 4: Payment does not exist
     *@see 5: Retry later
     *@see 6: Tips do not exist
     *@see 7: Accumulation does not exist
     *@see 8: Receiver group does not exist
     *@see 9: Question category does not exist
     *@see a1: Question does not exist
     *@see a2: Version does not exist
     *@see a3: Legal info request does not exist
     *@see a4: Chat does not exist
     *@see a5: Media does not exist
     *@see a6: Advantage does not exist
     *@see a7: Partner does not exist
     *@see a8: Employee rating does not exist
     *@see a9: Address does not exist
     *@see a0: Verification does not exist
     *@see b1: Document does not exist
     *@see b2: Coupon category does not exist
     *@see b3: Organization document does not exist
     *@see b4: Legal does not exist
     * 
     */
    static create(code: code, details?: string): UseCaseError {
        if (this.errors[code]) {
            const error = this.errors[code];
            error.details = details || '';
            return new UseCaseError(error.message, error.code, error.HTTPStatus, error.details);
        } else {
            throw new Error('Error code does not exit in the system');
        }
    }
}