import { APIRequestContext, APIResponse } from "@playwright/test";
import fs from "fs";

export class BaseAPI {

    url: string;
    request: APIRequestContext
    response: APIResponse

    constructor(request?: APIRequestContext) {
        if (request)
            this.request = request;
    }

    //POST|method
    protected async doPost(endpoint: string, file: string, mimeType: string): Promise<APIResponse> {
        console.log("POST | " + endpoint)
        const image = fs.readFileSync(file);
        const response = await this.request.post(endpoint, {
            headers: {
            },
            multipart: {
                file: {
                    name: file,
                    mimeType: mimeType,
                    buffer: image,
                }
            },
        });
        this.response = response;
        return response;
    }

    //GET|method
    protected async doGet(endpoint: string): Promise<APIResponse> {
        console.log("GET | " + endpoint)
        const response = await this.request.get(endpoint)
        this.response = response;
        return response;
    }

    //DELETE|method
    /*
        implement in the future
    */


    //PUT|method
    /*
        implement in the future
    */
}