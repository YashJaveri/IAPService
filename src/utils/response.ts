export class ResponseData{
    message?: string = ""
    resultCode?: string = "00"
    data: any = {}

    constructor(data: any, resultCode?: string, message?: string) {
        this.data = data
        this.message = message
        this.resultCode = resultCode        
    }
    
    toJSON() { 
        return {
            data: this.data,
            message: this.message,
            resultCode: this.resultCode
        }
    }
}