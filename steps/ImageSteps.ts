import { expect } from "@playwright/test";
import { BaseAPI } from "../base/BaseAPI";
import { EndPoint } from "../const/EndPoint";
import { MimeType } from "../const/MimeType";

export default class ImageSteps extends BaseAPI {

    imageLinkRegex = /https:\/\/assessement\.onrender\.com\/images\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/

    public async uploadAnImage(file) {
        this.response = await this.doPost(EndPoint.IMAGE_ENDPOINT, file, MimeType.IMAGE);
        return this.response;
    }

    public async uploadAnImageWithWrongEndpoint(file) {
        this.response = await this.doPost(EndPoint.WRONG_ENDPOINT, file, MimeType.IMAGE);
        return this.response;
    }

    //Verify the permanent image link is right format. E.g: https://assessement.onrender.com/images/3b22d180-b343-4d66-b24a-ef843241cdcc.png
    public verifyTheImageIsRightFormat(url: string) {
        expect(url).toMatch(this.imageLinkRegex);
    }

    //Verify the permanent image link is availabel
    public async verifyTheImageIsAvailabe(url: string) {
        const response1 = await this.doGet(url);
        expect(response1.status()).toBe(200);
    }
}