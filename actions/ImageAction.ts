import { APIResponse, expect } from "@playwright/test";
import { BaseAPI } from "../base/BaseAPI";
import { EndPoint } from "../const/EndPoint";
import { MimeType } from "../const/MimeType";

export const ImageAction = class ImageAction extends BaseAPI {
    response: APIResponse;
    imageLinkRegex = /https:\/\/assessement\.onrender\.com\/images\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
    bodyText;

    async uploadAnImage(file) {
        this.response = await this.doPost(EndPoint.IMAGE_ENDPOINT, file, MimeType.IMAGE);
        console.log(this.response.status());
        this.bodyText = JSON.parse(await this.response.text());
    }

    verifyOkStatusCode() {
        expect(this.response.ok()).toBeTruthy();
        expect(this.response.status()).toBe(200);
    }

    verifyHaveProperty(propety) {
        expect(this.bodyText).toHaveProperty(propety);
    }

    //Verify the permanent image link is right format. E.g: https://assessement.onrender.com/images/3b22d180-b343-4d66-b24a-ef843241cdcc.png
    async verifyTheImageIsRightFormat() {
        expect(this.bodyText.image).toMatch(this.imageLinkRegex);
    }

    //Verify the permanent image link is availabel
    async verifyTheImageIsAvailabe() {
        console.log(this.bodyText.image)
        const response1 = await this.doGet(this.bodyText.image);
        // console.log(response1.body)
        expect(response1.status()).toBe(200);
    }
}