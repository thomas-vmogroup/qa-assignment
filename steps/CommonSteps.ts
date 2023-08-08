import { APIResponse, expect } from "@playwright/test";
import { BaseAPI } from "../base/BaseAPI";

export const CommonSteps = class CommonSteps extends BaseAPI {
    imageLinkRegex = /https:\/\/assessement\.onrender\.com\/images\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/

    //Verify the permanent image link is right format. E.g: https://assessement.onrender.com/images/3b22d180-b343-4d66-b24a-ef843241cdcc.png
    async verifyTheImageIsRightFormat(url: string) {
        expect(url).toMatch(this.imageLinkRegex);
    }

    verifyStatusCodeIs(statusCode, response) {
        expect(response.status()).toBe(statusCode);
    }

    async verifyHaveProperty(propety, response) {
        const bodyJson = JSON.parse(await response.text());
        expect(bodyJson).toHaveProperty(propety);
    }

    async verifyErrorMessage(err: string, response) {
        const bodyJson = JSON.parse(await response.text());
        expect(bodyJson).toHaveProperty("err", err);
    }
}