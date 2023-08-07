import { APIRequestContext, APIResponse } from "@playwright/test";
import fs from "fs";

export class BaseAPI {

    url: string;
    request: APIRequestContext
    response: APIResponse


    constructor(request: APIRequestContext) {
        this.request = request;
    }

    //POST|method
    async doPost(endpoint: string, file: string, mimeType: string): Promise<APIResponse> {
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
    async doGet(endpoint: string): Promise<APIResponse> {
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