import { responseError } from "./response.helper.js";

export const handlerError = (err, req, res, next) => {
    const response = responseError(err.message, err.statusCode, err.stack);
    res.status(response.statusCode).json(response);
}
