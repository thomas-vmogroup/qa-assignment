import { test, expect } from "@playwright/test";
import path from "path";
import { BaseAPI } from "../base/BaseAPI"
import { EndPoint } from "../const/EndPoint";
import { Path } from "../const/Path";
import { MimeType } from "../const/MimeType";



test.describe('Upload image', () => {
    let action;
    let imageLinkRegex = /https:\/\/assessement\.onrender\.com\/images\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/

    test.beforeEach(async ({ request }) => {
        action = new BaseAPI(request);
    });

    test('should allow guest to upload an image', async () => {
        const fileName = "ngau-det-tml.webp";
        const file = path.resolve(Path.TEST_DATA, fileName);
        const response = await action.doPost(EndPoint.IMAGE_ENDPOINT, file, MimeType.IMAGE);
        const body = JSON.parse(await response.text());
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        expect(body).toHaveProperty("image");
        const imageLink = body.image;
        //Validate the permanen link should be https://assessement.onrender.com/images/d8f3bce4-20e0-4546-8972-80cbea16aaba.[fileType]
        expect(imageLink).toMatch(imageLinkRegex);
        console.log(imageLink);
    });

    test('Should not allow guest to upload the file is not a picture', async () => {
        const file = path.resolve(Path.TEST_DATA, "username.csv");
        const response = await action.doPost(EndPoint.IMAGE_ENDPOINT, file, MimeType.IMAGE);
        const body = JSON.parse(await response.text());
        console.log(body);
        expect(response.status()).toBe(500);
        expect(body).toHaveProperty("err", "File isn' an image");
    });
});
