import { test, expect } from "@playwright/test";
import path from "path";
import { BaseAPI } from "../base/BaseAPI"
import { EndPoint } from "../const/EndPoint";
import { Path } from "../const/Path";
import { MimeType } from "../const/MimeType";
import { Utilities } from "../util/Utilities";
import { CommonAction } from "../actions/CommonAction";


test.describe('Upload zip file', () => {
    let apiAction;
    const Util = new Utilities();
    let commonAction;

    test.beforeAll(async ({ request }) => {
        apiAction = new BaseAPI(request);
    });


    /*
Tescase 01: Should allow guest to upload an zip file contain multiple image files
Precondition: 
    - A zip file including the image file is provided
    - unzip file to a temp folder
    - Get list file from zip folder
Test Step: 
    - Send the post request to upload the zip file
    - Verify the status code should be 200
    - Verify the permanen file format for each file is coresponding with the zip temp folder
Postcondition:
    - temp folder should be deleted
*/
    test('Should allow guest to upload an zip file contain multiple image files', async ({ }) => {
        const zipFilePath = path.resolve(Path.ZIPS, "images.zip");
        const lisFileNameFromZipFile = await Util.readZipArchive(zipFilePath)

        const response = await apiAction.doPost(EndPoint.ZIP_ENDPOINT, zipFilePath, MimeType.ZIP);
        commonAction = new CommonAction(response);
        const body = JSON.parse(await response.text());
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        expect(body).toHaveProperty("images");
        const responseImageList = body.images
        console.log(responseImageList);
    });

});