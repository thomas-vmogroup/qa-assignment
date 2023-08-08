import { test, expect } from "@playwright/test";
import path from "path";
import { BaseAPI } from "../base/BaseAPI"
import { EndPoint } from "../const/EndPoint";
import { Path } from "../const/Path";
import { MimeType } from "../const/MimeType";
import { Utilities } from "../util/Utilities";
import { CommonSteps } from "../steps/CommonSteps";
import { ZipSteps } from "../steps/ZipSteps";
import { ImageSteps } from "../steps/ImageSteps";


let Util;
let commonSteps;
let zipSteps;
let imageSteps;


test.describe('Upload zip file', () => {
    test.beforeEach(async ({ request }) => {

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
    test.only('Should allow guest to upload an zip file contain multiple image files', async ({ request }) => {
        zipSteps = new ZipSteps(request)
        commonSteps = new CommonSteps(request);
        Util = new Utilities();
        imageSteps = new ImageSteps(request);

        const zipFilePath = path.resolve(Path.ZIPS, "images.zip");
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

        // await zipSteps.verifyZipfileAndResponeImagesAreCorresponding(lisFileNameFromZipFile)
        console.log(lisFileNameFromZipFile.length + "Input images: " + lisFileNameFromZipFile);
        console.log(responseImageList.length + "Response images: " + responseImageList);


    });


    //"File isn' a zip"
});