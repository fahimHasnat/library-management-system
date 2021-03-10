exports.requiredError = (fields, body) => {
    const result = fields.filter((item) => !body[item]);
    // const result = fields.filter(item => Object.keys(body).indexOf(item) == -1);
    const error = new Error(`Required field(s) : ${result.join(", ")} `);
    error.statusCode = 400;
    error.data = null;
    throw error;
}