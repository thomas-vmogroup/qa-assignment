import { test } from "@playwright/test";
import path from "path";
import { Path } from "../const/Path";
import { Utilities } from "../util/Utilities"
import { CommonSteps } from "../steps/CommonSteps";
import { ImageSteps } from "../steps/ImageSteps";

let commonSteps;
let imageSteps;


/*
    User Story 1 - In order to store and use my pictures through the https://assessement.onrender.com/api/image API service: 
    As an Anonymous user, I want to attach a picture to the Service and I want to have a permanent link to this picture, 
    Otherwise, I want to be rejected and informed if the file is not a picture.
*/


test.describe('Upload image', () => {
    test.beforeEach(async ({ request }) => {
        imageSteps = new ImageSteps(request)
        commonSteps = new CommonSteps(request);
    });

    const imageList = new Utilities().getFilesFromFolder(Path.IMAGES, []);
    /*
    TC_01: Should allow guest to upload the file is a picture
    Precondition:
        - A list of image files are provided (The file should be: png/jpeg/gif/webp/tif/sgv)
    Test Step: 
        - Read the image files from image folder
        - Send the post request to upload the image
        - Verify the status code should be 200
        - Verify the body response should have "image" field
        - Verify the image permanent link format
        - Verify the image permanent link should be accessible (Call an get request and verify the status code = 200)
    */
    for (const file of imageList) {
        test(`Should allow guest to upload an image ${file}`, async ({ }) => {

            //const file = Util.getRandomItemFromArrayList(imageList);
            console.log(file)
            const response = await imageSteps.uploadAnImage(file);

            await commonSteps.verifyStatusCodeIs(200, response);
            await commonSteps.verifyHaveProperty("image", response);

            const imageLink = JSON.parse(await response.text()).image;
            await imageSteps.verifyTheImageIsRightFormat(imageLink);
            await imageSteps.verifyTheImageIsAvailabe(imageLink);
        });
    }
    /*
    TC_02: Should not allow guest to upload the file is not a picture
    Precondition:
        - A non image file is provided (e.g: file.csv)
    Test Step: 
        - Send the post request to upload the image
        - Verify the status code should be 403
        - Verify the body response should have "err" field with the message: File isn' an image
    */
    test('Should not allow guest to upload the file is not a picture', async () => {
        const file = path.resolve(Path.OTHERS, "username.csv");
        const response = await imageSteps.uploadAnImage(file);
        await commonSteps.verifyStatusCodeIs(403, response);
        await commonSteps.verifyErrorMessage("File isn' an image", response);
    });
});
