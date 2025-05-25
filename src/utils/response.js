/**
 * Utility functions for standardized API responses.
 */

function successResponse(res, data = {}, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
        status_code: statusCode,
        success: true,
        message,
        data,
    });
}

function errorResponse(res, error = {}, message = 'Error', statusCode = 500) {
    return res.status(statusCode).json({
        status_code: statusCode,
        success: false,
        message,
        error,
    });
}

export {
    successResponse,
    errorResponse,
};