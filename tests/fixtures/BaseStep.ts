import { test as base } from "@playwright/test";
import CommonSteps from "../../steps/CommonSteps";
import ImageSteps from "../../steps/ImageSteps";
import ZipSteps from "../../steps/ZipSteps";

export const test = base.extend<{
    commonSteps: CommonSteps;
    imageSteps: ImageSteps;
    zipSteps: ZipSteps;
}>({
    commonSteps: async ({ request }, use) => {
        await use(new CommonSteps(request));
    },

    imageSteps: async ({ request }, use) => {
        await use(new ImageSteps(request));
    },

    zipSteps: async ({ request }, use) => {
        await use(new ZipSteps(request));
    },
})