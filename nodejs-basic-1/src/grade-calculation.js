const averageExams = (valuesExam) => {
    const numberValidation = valuesExam.every(exam => typeof exam === 'number');
    if (!numberValidation) throw Error('please input number');
 
    const sumValues = valuesExam.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return sumValues / valuesExam.length;
};

const isStudentPassExam = (valuesExam, name) => {
    const minValues = 75;
    const average = averageExams(valuesExam);
    
    if (average < minValues) {
        console.log(`${name} is fail the exams`);
        return false;
    } else {
        console.log(`${name} is pass the exams`);
        return true;
    }
};
 
module.exports = { averageExams, isStudentPassExam };