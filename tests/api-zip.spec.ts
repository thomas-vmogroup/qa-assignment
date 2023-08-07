import { test, expect } from "@playwright/test";
import path from "path";
import { BaseAPI } from "../base/BaseAPI"
import { EndPoint } from "../const/EndPoint";
import { Path } from "../const/Path";
import { MimeType } from "../const/MimeType";


test.describe('Upload zip file', () => {
    let action;
    let imageLinkRegex = /https:\/\/assessement\.onrender\.com\/images\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/

    test.beforeEach(async ({ request }) => {
        action = new BaseAPI(request);
    });

    test('Should allow guest to upload an zip file contain multiple image files', async ({ request }) => {

        const file = path.resolve(Path.TEST_DATA, "images.zip");
        const response = await action.doPost(EndPoint.ZIP_ENDPOINT, file, MimeType.ZIP);
        const body = JSON.parse(await response.text());
        console.log(body);
    });

});