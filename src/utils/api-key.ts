import uuidApikey from "uuid-apikey";

export function createApiKey(){
    let apiKey = uuidApikey.create()
    return apiKey
}