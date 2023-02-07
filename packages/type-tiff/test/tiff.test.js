import { Jimp, getTestDir } from "@jimp/test-utils";
import configure from "@jimp/custom";
import expectImport from "@storybook/expect";
import * as url from "url";
import tiff from "../src";

const expect = expectImport.default;
const jimp = configure({ types: [tiff] }, Jimp);

describe("TIFF", () => {
  const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
  const imagesDir = getTestDir(__dirname) + "/images";

  it("load TIFF", async () => {
    const image = await jimp.read(imagesDir + "/rgb.tiff");

    expect(image.getPixelColor(10, 10)).toBe(0xa4988bff);
    expect(image.getPixelColor(220, 190)).toBe(0xe0d7ddff);
    expect(image.getPixelColor(350, 130)).toBe(0x565433ff);
  });

  const simpleJGD = {
    width: 3,
    height: 3,
    data: [
      0xff0000ff, 0xff0080ff, 0xff00ffff, 0xff0080ff, 0xff00ffff, 0x8000ffff,
      0xff00ffff, 0x8000ffff, 0x0000ffff,
    ],
  };

  it("export TIFF", async () => {
    const image = await jimp.read(simpleJGD);
    const buffer = await image.getBufferAsync("image/tiff");

    expect(buffer.toString()).toMatch(/^MM\u0000*\u0000/);
  });
});
