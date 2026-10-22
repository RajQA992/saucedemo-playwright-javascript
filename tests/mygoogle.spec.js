const { expect, test } = require('@playwright/test');

test.only("verify the youtube", async({page})=>
{

    await page.goto("https://www.youtube.com");

});