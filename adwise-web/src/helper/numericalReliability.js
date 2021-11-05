const NumericalReliability = (number, titles) => {
    // titles [1, 2, 5];

    number = Math.abs(number);
    if (Number.isInteger(number)) {
        let cases = [2, 0, 1, 1, 1, 2];
        return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
    }
    return titles[1];
}

export {
    NumericalReliability
}
