interface IEmployeeRole {
    [key: string]: boolean
}

/**
 * EmployeeRole provides static EmployeeRole list
 */
class EmployeeRole {
    private static readonly list: IEmployeeRole = {
        'cashier': true,
        'manager': true
    };

    public static getList(): (keyof IEmployeeRole)[] {
        return Object.keys(EmployeeRole.list);
    }

    public static isValid(employeeRole: string): boolean {
        return !!EmployeeRole.list[employeeRole];
    }
}

export default EmployeeRole;