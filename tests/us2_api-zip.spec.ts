import { test } from "@playwright/test";
import path from "path";
import { Path } from "../const/Path";
import { Utilities } from "../util/Utilities";
import { CommonSteps } from "../steps/CommonSteps";
import { ZipSteps } from "../steps/ZipSteps";
import { ImageSteps } from "../steps/ImageSteps";


let Util;
let commonSteps;
let zipSteps;
let imageSteps;

/*
    User Story 2 - In order to save my time from uploading my pictures multiple times via 
    https://assessement.onrender.com/api/zip API service: As an Anonymous user, I want to attach a zip file 
    containing multiple images and I want each of these uploaded images to have a permanent link.
*/

test.describe('Upload zip file', () => {
    test.beforeEach(async ({ request }) => {
        zipSteps = new ZipSteps(request)
        commonSteps = new CommonSteps(request);
        Util = new Utilities();
        imageSteps = new ImageSteps(request);
    });


    /*
Tescase 01: Should allow guest to upload an zip file contain multiple image files
Precondition: 
    - A zip file including the image file is provided
Test Step: 
    - Send the post request to upload the zip file
    - Verify the status code should be 200
    - Read the input zip file and get the list of file name.
    - Verify each of file from response body image list should be accessible: Send GET request and validate response code = 200
    - Verify the permanen file format for each file is coresponding with the zip temp folder:
        + The number of image files inside the zip file = the number of file from response body
        + The format of file should be coresponsding
Postcondition:
    - temp folder should be deleted
*/
    test('Should allow guest to upload an zip file contain multiple image files', async ({ }) => {
        const zipFilePath = path.resolve(Path.ZIPS, "images-only.zip");
        const lisFileNameFromZipFile = await Util.readZipArchive(zipFilePath)

        const response = await zipSteps.uploadAZipFile(zipFilePath);
        await commonSteps.verifyStatusCodeIs(200, response);
        await commonSteps.verifyHaveProperty("images", response);
        await zipSteps.verifyLisOfImageAreCorrectFormat();

        //Verify each of file from response body image list should be accessible: Send GET request and validate response code = 200
        const responseImageList = await zipSteps.getTheResponseImageList();
        for (var i = 0; i < responseImageList.length; i++) {
            await imageSteps.verifyTheImageIsAvailabe(responseImageList[i]);
        }

        await zipSteps.verifyZipfileAndResponeImagesAreCorresponding(lisFileNameFromZipFile)


    });

    /*
    Tescase 02: Should not allow guest to upload the file is not a zip file
    Precondition:
        - A non zip file is provided (e.g: file.csv)
    Test Step: 
        - Provide the file is not a zip file
        - Send the post request to upload the zip file
        - Verify the status code should be 403
        - Verify the body response should have "err" field with the message: File isn' a zip
    */
    test('Should not allow guest to upload the file is not a zip', async () => {
        const file = path.resolve(Path.OTHERS, "username.csv");
        const response = await zipSteps.uploadAZipFile(file);
        await commonSteps.verifyStatusCodeIs(403, response);
        await commonSteps.verifyErrorMessage("File isn' a zip", response);
    });
});