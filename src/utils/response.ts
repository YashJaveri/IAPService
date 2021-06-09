export class ResponseData{
    data: any = {}
    message?: string = undefined
    resultCode?: string = "00"

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