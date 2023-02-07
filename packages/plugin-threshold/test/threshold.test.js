import { Jimp, getTestDir } from "@jimp/test-utils";
import configure from "@jimp/custom";
import jpeg from "@jimp/jpeg";
import color from "@jimp/plugin-color";
import resize from "@jimp/plugin-resize";
import expectImport from "@storybook/expect";
import * as url from "url";

import threshold from "../src";

const expect = expectImport.default;

const jimp = configure(
  { types: [jpeg], plugins: [threshold, color, resize] },
  Jimp
);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

describe("Threshold", function () {
  this.timeout(15000);

  it("defines default threshold for lighter backgrounds", async () => {
    const expectedImage = await jimp.read(
      getTestDir(__dirname) + "/images/hands_mx200_rp255.jpg"
    );
    const testImage = await jimp.read(
      getTestDir(__dirname) + "/images/hands.jpg"
    );

    expect(testImage.threshold({ max: 200, replace: 255 }).hash()).toBe(
      expectedImage.hash()
    );
  });
});
