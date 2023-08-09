import path from "path";
import { Path } from "../const/Path";
import { Utilities } from "../util/Utilities";
import { test } from "./fixtures/BaseStep";
import { FileName } from "../const/FileName";

let Util = new Utilities();
let response;
/*
    User Story 2 - In order to save my time from uploading my pictures multiple times via 
    https://assessement.onrender.com/api/zip API service: As an Anonymous user, I want to attach a zip file 
    containing multiple images and I want each of these uploaded images to have a permanent link.
*/

test.describe('User Story 2| Upload zip function', () => {

    /*
        TC_01: Should allow guest to upload an zip file contain multiple image files
        Precondition: 
            - A zip file including the image file is provided
        Test Step: 
            - Send the "POST | /api/zip" request to upload the zip file
            - Verify the status code should be 200
            - Verify the response body has property "images"
            - Read the input zip file and get the list of file name.
            - Verify list of images are correct format: https://assessement.onrender.com/images/<UUID>.<extention>
            - Verify each of file from response body image list should be accessible: Send GET |/images/<return-image>.<extention> request and validate response code = 200
            - Verify the permanen file format for each file is coresponding with the zip file:
                + The number of image files inside the zip file = the number of file from response body
                + The format of file should be coresponsding
    */
    test('Should allow guest to upload an zip file contain multiple image files', async ({ zipSteps, commonSteps, imageSteps }) => {
        let responseImageList;
        const zipFilePath = path.resolve(Path.ZIPS, FileName.ZIP_FILE);
        const lisFileNameFromZipFile = Util.readZipArchive(zipFilePath)

        await test.step(`Send the "POST | /api/zip" request to upload the zip file`, async () => {
            response = await zipSteps.uploadAZipFile(zipFilePath);
        })

        await test.step(`Verify the status code should be 200`, async () => {
            await commonSteps.verifyStatusCodeIs(200, response);
        })

        await test.step(`Verify the response body has property "images"`, async () => {
            await commonSteps.verifyHaveProperty("images", response);
        })

        await test.step(`Verify list of images are correct format: https://assessement.onrender.com/images/<UUID>.<extention>`, async () => {
            await zipSteps.verifyLisOfImageAreCorrectFormat();
        })

        await test.step(`Verify each of file from response body image list should be accessible`, async () => {
            responseImageList = await zipSteps.getTheResponseImageList();
            for (var i = 0; i < responseImageList.length; i++) {
                await imageSteps.verifyTheImageIsAvailabe(responseImageList[i]);
            }
        })
        await test.step(`Verify the permanen file format for each file is coresponding with the zip temp folder`, async () => {
            await zipSteps.verifyZipfileAndResponeImagesAreCorresponding(lisFileNameFromZipFile)
        })
    });

    /*
    Tescase 02: Should not allow guest to upload the file is not a zip file
    Precondition:
        - A non zip file is provided (e.g: file.csv)
    Test Step: 
        - Send the "POST | /api/zip" request with any non zip file
        - Verify the status code should be 403
        - Verify the body response should have "err" field with the message: "File isn' a zip"
    */
    test('Should not allow guest to upload the file is not a zip', async ({ zipSteps, commonSteps }) => {
        const file = path.resolve(Path.OTHERS, FileName.CSV_FILE);
        await test.step(`Send the "POST | /api/zip" request with any non zip file`, async () => {
            response = await zipSteps.uploadAZipFile(file);
        })

        await test.step(`Verify the status code should be 403`, async () => {
            await commonSteps.verifyStatusCodeIs(403, response);
        })

        await test.step(`Verify the body response should have "err" field with the message: "File isn' a zip"`, async () => {
            await commonSteps.verifyErrorMessage("File isn' a zip", response);
        })

    });

    /*
    Tescase 03: Should allow guest to upload the file is zip file which is not contain any image file
    Precondition:
        - A zip file which is not contain any image file is provided
    Test Step: 
        - Send the POST | /api/zip request to upload the zip file
        - Verify the status code should be 500
        - Verify the body response should have "err" field with the message: "no image found in zip file"
    */
    test('Should allow guest to upload the file is zip file which is not contain any image file', async ({ zipSteps, commonSteps }) => {
        const file = path.resolve(Path.ZIPS, FileName.NOT_CONTAIN_IMAGE_FILE);

        await test.step(`Send the "POST | /api/zip" request to upload the zip file`, async () => {
            response = await zipSteps.uploadAZipFile(file);
        })


        await test.step(`Verify the status code should be 500`, async () => {
            await commonSteps.verifyStatusCodeIs(500, response);
        })

        await test.step(`Verify the body response should have "err" field with the message: "no image found in zip file"`, async () => {
            await commonSteps.verifyErrorMessage("no image found in zip file", response);
        })
    });
});