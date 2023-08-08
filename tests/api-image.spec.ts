import { test } from "@playwright/test";
import path from "path";
import { Path } from "../const/Path";
import { Utilities } from "../util/Utilities"
import { CommonSteps } from "../steps/CommonSteps";
import { ImageSteps } from "../steps/ImageSteps";

let Util;
let commonSteps;
let imageSteps;

test.describe('Upload image', () => {
    test.beforeEach(async ({ request }) => {
        imageSteps = new ImageSteps(request)
        commonSteps = new CommonSteps(request);
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
        - Verify the image permanent link format
        - Verify the image permanent link should be accessible (Call an get request and verify the status code = 200)
    */
    test('Should allow guest to upload an image', async () => {
        const imageList = Util.getFilesFromFolder(Path.IMAGES, []);
        const file = Util.getRandomItemFromArrayList(imageList);
        const response = await imageSteps.uploadAnImage(file);

        await commonSteps.verifyStatusCodeIs(200, response);
        await commonSteps.verifyHaveProperty("image", response);

        const imageLink = JSON.parse(await response.text()).image;
        await imageSteps.verifyTheImageIsRightFormat(imageLink);
        await imageSteps.verifyTheImageIsAvailabe(imageLink);
    });

    /*
    Tescase 02: Should not allow guest to upload the file is not a picture
    Precondition:
        - A non image file is provided (e.g: file.csv)
    Test Step: 
        - Provide the file is not a picture file
        - Send the post request to upload the image
        - Verify the status code should be 500
        - Verify the body response should have "err" field with the message: File isn' an image
    */
    test('Should not allow guest to upload the file is not a picture', async () => {
        const file = path.resolve(Path.OTHERS, "username.csv");
        const response = await imageSteps.uploadAnImage(file);
        await commonSteps.verifyStatusCodeIs(500, response);
        await commonSteps.verifyErrorMessage("File isn' an image")
    });
});
