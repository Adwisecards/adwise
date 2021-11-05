interface IQuestionType {
    [key: string]: boolean
};

/**
 * QuestionType provides static QuestionType list
 */
class QuestionType {
    private static readonly list: IQuestionType = {
        'business': true,
        'crm': true,
        'cards': true
    };

    public static getList(): (keyof IQuestionType)[] {
        return Object.keys(QuestionType.list);
    }

    public static isValid(questionType: string): boolean {
        return !!QuestionType.list[questionType];
    }
}

export default QuestionType;