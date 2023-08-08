import { expect, APIRequestContext } from "@playwright/test";
import { BaseAPI } from "../base/BaseAPI";
import { EndPoint } from "../const/EndPoint";
import { MimeType } from "../const/MimeType";
import { ImageSteps } from "./ImageSteps";

export const ZipSteps = class ZipSteps extends BaseAPI {
    request1: APIRequestContext;

    public async uploadAZipFile(file) {
        this.response = await this.doPost(EndPoint.ZIP_ENDPOINT, file, MimeType.ZIP);
        return this.response;
    }

    private async getTheResponseImageList() {
        const body = JSON.parse(await this.response.text());
        return body.images;
    }

    async verifyLisOfImageAreCorrectFormat() {
        const responseImageList = await this.getTheResponseImageList();
        const imageStep = new ImageSteps();
        for (var i = 0; i < responseImageList.length; i++) {
            await imageStep.verifyTheImageIsRightFormat(responseImageList[i]);
        }
    }

    async verifyZipfileAndResponeImagesAreCorresponding(lisFileNameFromZipFile) {
        const responseImageList = await this.getTheResponseImageList();
        console.log("lisFileNameFromZipFile" + lisFileNameFromZipFile);
        console.log("responseImageList" + responseImageList);
    }

}