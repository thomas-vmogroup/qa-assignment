import { expect } from "@playwright/test";
import { BaseAPI } from "../base/BaseAPI";
import { EndPoint } from "../const/EndPoint";
import { MimeType } from "../const/MimeType";

export const ImageAction = class ImageAction extends BaseAPI {
    // response: APIResponse;
    imageLinkRegex = /https:\/\/assessement\.onrender\.com\/images\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
    bodyJson;

    async uploadAnImage(file) {
        this.response = await this.doPost(EndPoint.IMAGE_ENDPOINT, file, MimeType.IMAGE);
        this.bodyJson = JSON.parse(await this.response.text());
        console.log("uploadAnImage " + this.bodyJson.image);
    }

    verifyOkStatusCode() {
        expect(this.response.status()).toBe(200);
    }

    verifyHaveProperty(propety) {
        expect(this.bodyJson).toHaveProperty(propety);

    }

    //Verify the permanent image link is right format. E.g: https://assessement.onrender.com/images/3b22d180-b343-4d66-b24a-ef843241cdcc.png
    verifyTheImageIsRightFormat() {
        expect(this.bodyJson.image).toMatch(this.imageLinkRegex);
    }

    //Verify the permanent image link is availabel
    getTheResponseBodyJson() {
        return this.bodyJson;
    }

    getTheResponseBody() {
        return this.response;
    }

    verifyErrorMessage() {
        expect(this.bodyJson).toHaveProperty("err", "File isn' an image");
    }
}