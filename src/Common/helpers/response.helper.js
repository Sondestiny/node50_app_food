export const responseError = (message='Internal sever Error',statusCode=500, stack=null) => {
    return {
        status: 'error',
        statusCode,
        message,
        stack,
    }
}
export const responseSuccess = (data=null, message = '', statusCode=200) => {
    return {
        status: 'success',
        statusCode: statusCode,
        message: message,
        data: data,
        doc: 'domain.com/doc-api'
    }
}