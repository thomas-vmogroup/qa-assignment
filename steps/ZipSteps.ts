import { expect, APIRequestContext } from "@playwright/test";
import { BaseAPI } from "../base/BaseAPI";
import { EndPoint } from "../const/EndPoint";
import { MimeType } from "../const/MimeType";
import ImageSteps from "./ImageSteps";

export default class ZipSteps extends BaseAPI {
    request1: APIRequestContext;

    public async uploadAZipFile(file) {
        this.response = await this.doPost(EndPoint.ZIP_ENDPOINT, file, MimeType.ZIP);
        return this.response;
    }

    public async getTheResponseImageList() {
        const body = JSON.parse(await this.response.text());
        return body.images;
    }

    public async verifyLisOfImageAreCorrectFormat() {
        const responseImageList = await this.getTheResponseImageList();
        const imageStep = new ImageSteps();
        for (var i = 0; i < responseImageList.length; i++) {
            await imageStep.verifyTheImageIsRightFormat(responseImageList[i]);
        }
    }

    public async verifyZipfileAndResponeImagesAreCorresponding(lisFileNameFromZipFile) {
        const responseImageList = await this.getTheResponseImageList();
        expect(lisFileNameFromZipFile.length).toBe(responseImageList.length)
        for (var i = 0; i < responseImageList.length; i++) {
            expect(this.getTheFileExtention(lisFileNameFromZipFile[i])).toBe(this.getTheFileExtention(responseImageList[i]))
        }
    }

    //Get the file extention
    private getTheFileExtention(fileName: string) {
        return fileName.split(".").pop();
    }

}