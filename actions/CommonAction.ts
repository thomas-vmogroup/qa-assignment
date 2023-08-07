import { APIResponse, expect } from "@playwright/test";
import { BaseAPI } from "../base/BaseAPI";

export const CommonAction = class CommonAction extends BaseAPI {
    response: APIResponse;
    imageLinkRegex = /https:\/\/assessement\.onrender\.com\/images\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/

    //Verify the permanent image link is right format. E.g: https://assessement.onrender.com/images/3b22d180-b343-4d66-b24a-ef843241cdcc.png
    async verifyTheImageIsRightFormat(url: string) {
        expect(url).toMatch(this.imageLinkRegex);
    }

    //Verify the permanent image link is availabel
    async verifyTheImageIsAvailabe(url: string) {
        console.log(url)
        const response1 = await this.doGet(url);
        // console.log(response1.body)
        expect(response1.status()).toBe(200);
    }
}