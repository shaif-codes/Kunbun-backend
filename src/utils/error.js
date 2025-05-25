

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const castError = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const dupFieldError = err => {
    const value = err.keyValue ? JSON.stringify(err.keyValue) : '';
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const validationError = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const jwtError = () =>
    new AppError('Invalid token. Please log in again!', 401);

const jwtExpired = () =>
    new AppError('Your token has expired! Please log in again.', 401);

const invalidCred = (res) => {
    const error = new AppError('Invalid credentials', 401);
    res.status(401).json({
        status_code: error.statusCode,
        status: error.status,
        message: error.message,
    });
}

const roleNotAuthorized = (res) => {
    const error = new AppError('You do not have permission to perform this action', 403);
    res.status(403).json({
        status_code: error.statusCode,
        status: error.status,
        message: error.message,
    });
}

const notFound = (res) => (whatNotFound = null) => {
    const error = new AppError(`${whatNotFound || "data"} not found!`, 404);
    res.status(404).json({
        status_code: error.statusCode,
        status: error.status,
        message: error.message,
    });
}

export {
    AppError,
    castError,
    dupFieldError,
    validationError,
    jwtError,
    jwtExpired,
    invalidCred,
    notFound,
    roleNotAuthorized
};