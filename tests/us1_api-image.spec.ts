import path from "path";
import { Path } from "../const/Path";
import { Utilities } from "../util/Utilities"
import { test } from "./fixtures/BaseStep";
import { FileName } from "../const/FileName";

let response;
/*
    User Story 1 - In order to store and use my pictures through the https://assessement.onrender.com/api/image API service: 
    As an Anonymous user, I want to attach a picture to the Service and I want to have a permanent link to this picture, 
    Otherwise, I want to be rejected and informed if the file is not a picture.
*/
test.describe('User Story 1| Upload image function', () => {

    const imageList = new Utilities().getFilesFromFolder(Path.IMAGES, []);
    /*
    TC_01: Should allow guest to upload the file is a picture
    Precondition:
        - Read the image files from image folder
        - A list of image files are provided (The file should be: png/jpeg/gif/webp/tif/sgv)
    Test Step: 
        - Send the "POST | /api/image" request to upload the image
        - Verify the status code should be 200
        - Verify the body response should have "image" field
        - Verify the image permanent link format
        - Verify the image permanent link should be accessible (Call an get request and verify the status code = 200)
    */
    for (const file of imageList) {
        test(`Should allow guest to upload an image ${file}`, async ({ imageSteps, commonSteps }) => {
            let imageLink;
            await test.step(`Send the "POST | /api/image" request to upload the image`, async () => {
                response = await imageSteps.uploadAnImage(file);
            })

            await test.step("Verify the status code should be 200", async () => {
                await commonSteps.verifyStatusCodeIs(200, response);
            })

            await test.step(`Verify the body response should have "image" field`, async () => {
                await commonSteps.verifyHaveProperty("image", response);
                imageLink = JSON.parse(await response.text()).image;
            })

            await test.step(`Verify the image permanent link format`, async () => {
                await imageSteps.verifyTheImageIsRightFormat(imageLink);
            })

            await test.step(`Verify the image permanent link should be accessible`, async () => {
                await imageSteps.verifyTheImageIsAvailabe(imageLink);
            })
        });
    }

    /*
    TC_02: Should not allow guest to upload the file is not a picture
    Precondition:
        - A non image file is provided (e.g: file.csv)
    Test Step: 
        - Send the "POST | /api/image" request to upload the image
        - Verify the status code should be 403
        - Verify the body response should have "err" field with the message: File isn' an image
    */
    test('Should not allow guest to upload the file is not a picture', async ({ imageSteps, commonSteps }) => {
        const file = path.resolve(Path.OTHERS, FileName.CSV_FILE);
        await test.step(`Send the "POST | /api/image" request to upload the image`, async () => {
            response = await imageSteps.uploadAnImage(file);
        })

        await test.step(`Verify the status code should be 403`, async () => {
            await commonSteps.verifyStatusCodeIs(403, response);
        })

        await test.step(`Verify the body response should have "err" field with the message: File isn' an image`, async () => {
            await commonSteps.verifyErrorMessage("File isn' an image", response);
        })

    });

    /*
    TC_03: Should return an error once guest upload the file with the wrong endpoint
    Precondition:
        - Any valid image is provided
    Test Step: 
        - Send the "POST | /api/wrong" request to upload the image with the wrong endpoint
        - Verify the status code should be 404
    */
    test('Should return an error once guest upload the file with the wrong endpoint', async ({ imageSteps, commonSteps }) => {
        const file = path.resolve(Path.IMAGES, FileName.IMAGES_FILE);

        await test.step(`Send the "POST | /api/image" request to upload the image with the wrong endpoint`, async () => {
            response = await imageSteps.uploadAnImageWithWrongEndpoint(file);
        })

        await test.step(`Verify the status code should be 404`, async () => {
            await commonSteps.verifyStatusCodeIs(404, response);
        })
    });
});
