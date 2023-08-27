import { getRequest } from "./Server.js";

function sendFHttpRequest(request) {
    let reply = getRequest(request);
    console.log(2, reply);
    //reply = JSON.parse(reply);
    return reply.data
}

export class FXMLhttpRequest {
    constructor() {
        this._type = undefined;
        this._url = undefined;
        this.response = undefined;
        this.onLoad = function(){};
    }
    
    open(type, url) {
        this._type = type;
        this._url = url;
    }

    send(body) {
        let request = new Request(this._type, this._url, body);
        request = JSON.stringify(request)
        this.response = sendFHttpRequest(request)
        this.onLoad();
    }
}

class Request {
    constructor(method, url, data = {}) {
        this.method = method;
        this.url = url;
        this.data = data
    }
}