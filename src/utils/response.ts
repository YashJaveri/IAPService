export class ResponseData{
    message?: string = ""
    resultCode?: string = "00"
    data: any = {}

    constructor(data: any, resultCode?: string, message?: string) {
        this.data = data
        this.message = message
        this.resultCode = resultCode        
    }
    toResponseData() { 
        return {
            data: this.data,
            message: this.message,
            resultCode: this.resultCode
        }
    }
}