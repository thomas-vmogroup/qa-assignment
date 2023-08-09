import { APIResponse, expect } from "@playwright/test";
import { BaseAPI } from "../base/BaseAPI";

export default class CommonSteps extends BaseAPI {

    public verifyStatusCodeIs(statusCode, response) {
        expect(response.status()).toBe(statusCode);
    }

    public async verifyHaveProperty(propety, response) {
        const bodyJson = JSON.parse(await response.text());
        expect(bodyJson).toHaveProperty(propety);
    }

    public async verifyErrorMessage(err: string, response) {
        const bodyJson = JSON.parse(await response.text());
        expect(bodyJson).toHaveProperty("err", err);
    }
}