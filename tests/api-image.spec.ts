import { test, expect } from "@playwright/test";
import path from "path";
import { BaseAPI } from "../base/BaseAPI"
import { EndPoint } from "../const/EndPoint";
import { Path } from "../const/Path";
import { MimeType } from "../const/MimeType";
import { Utilities } from "../util/Utilities"
import { CommonAction } from "../actions/CommonAction";
import { ImageAction } from "../actions/ImageAction";

let action;
let Util;
let commonAction;
let imageAction;

test.describe('Upload image', () => {
    test.beforeEach(async ({ request }) => {
        imageAction = new ImageAction(request)
        // action = new BaseAPI(request);
        commonAction = new CommonAction(request);
        Util = new Utilities();

    });

    /*
    Tescase 01: Should allow guest to upload the file is a picture
    Precondition:
        - An image file is provided (The file should be: png/jpeg/gif/webp)
    Test Step: 
        - Read the random image file from image folder
        - Send the post request to upload the image
        - Verify the status code should be 200
        - Verify the body response should have "image" field
        - Verify the permanen file format
    */

    test.only('Should allow guest to upload an image', async () => {
        const imageList = Util.getFilesFromFolder(Path.IMAGES, []);
        const file = Util.getRandomItemFromArrayList(imageList);
        imageAction.uploadAnImage(file);
        imageAction.verifyOkStatusCode();
        imageAction.verifyHaveProperty("image");
        imageAction.verifyTheImageIsRightFormat();
        commonAction.verifyTheImageIsAvailabe();
    });

    // test.only('Should allow guest to upload an image', async () => {
    //     const imageList = Util.getFilesFromFolder(Path.IMAGES, []);
    //     const file = Util.getRandomItemFromArrayList(imageList);
    //     const response = await action.doPost(EndPoint.IMAGE_ENDPOINT, file, MimeType.IMAGE);
    //     const bodyText = JSON.parse(await response.text());
    //     console.log("Response: " + bodyText)
    //     expect(response.ok()).toBeTruthy();
    //     expect(response.status()).toBe(200);
    //     expect(bodyText).toHaveProperty("image");
    //     commonAction.verifyTheImageIsRightFormat(bodyText.image);
    //     commonAction.verifyTheImageIsAvailabe(bodyText.image);
    // });


    /*
    Tescase 02: Should not allow guest to upload the file is not a picture
    Test Step: 
        - Provide the file is not a picture file
        - Send the post request to upload the image
        - Verify the status code should be 500
        - Verify the body response should have "err" field with the message: File isn' an image
    */

    test('Should not allow guest to upload the file is not a picture', async () => {
        const file = path.resolve(Path.OTHERS, "username.csv");
        const response = await action.doPost(EndPoint.IMAGE_ENDPOINT, file, MimeType.IMAGE);
        const body = JSON.parse(await response.text());
        expect(response.status()).toBe(500);
        expect(body).toHaveProperty("err", "File isn' an image");
    });
});
