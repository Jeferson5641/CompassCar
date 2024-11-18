const validateCarData = ({ brand, model, year, items }) => {
    const errors = [];
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 10;

    if (!brand) errors.push("marca é necessária");
    if (!model) errors.push("modelo é necessário");
    if (!year) {
        errors.push("ano é necessário");
    } else if (year < minYear || year > currentYear + 1) {
        errors.push("ano deve ser entre " + minYear + " e " + (currentYear + 1));
    }

    if (!items || !Array.isArray(items)) errors.push("os itens devem ser uma matriz");

    return errors;
};

module.exports = { validateCarData };
