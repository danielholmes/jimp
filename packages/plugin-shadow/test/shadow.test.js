import { Jimp, mkJGD, getTestDir } from "@jimp/test-utils";
import configure from "@jimp/custom";
import resize from "@jimp/plugin-resize";
import blur from "@jimp/plugin-blur";
import expectImport from "@storybook/expect";
import * as url from "url";

import shadow from "../src";

const expect = expectImport.default;

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const jimp = configure({ plugins: [shadow, resize, blur] }, Jimp);

describe("Shadow", () => {
  it("creates a shadow", async () => {
    const expectedImg = await jimp.read(
      getTestDir(__dirname) + "/images/shadow.png"
    );
    const testImage = await jimp.read(
      mkJGD(
        "          ",
        "    ◆◆    ",
        "   ◆▦▦◆   ",
        "  ◆▦▦▦▦◆  ",
        "   ◆▦▦◆   ",
        "    ◆◆    ",
        "          "
      )
    );

    expect(testImage.shadow({ x: -1, y: 1, blur: 1 }).bitmap.data).toEqual(
      expectedImg.bitmap.data
    );
  });
});
