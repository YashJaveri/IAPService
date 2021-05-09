export default class ApiError{
    message?: string
    resultCode: string
    responseCode: number = 400
    name: string

    constructor(resultCode: string, responseCode: number = 400, message?: string) {
        this.message = message
        this.resultCode = resultCode
        this.responseCode = responseCode
        this.name = 'ApiError'
    }
    toResponseData() { 
        return {
            message: this.message,
            resultCode: this.resultCode
        }
    }
}