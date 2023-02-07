import fs from "fs";
import { Jimp as jimp, getTestDir } from "@jimp/test-utils";
import expectImport from "@storybook/expect";
import * as url from "url";

const expect = expectImport.default;

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const imagesDir = getTestDir(__dirname) + "/images";

describe("FileType", () => {
  it("write uses original MIME type", async () => {
    if (process.env.ENV === "browser") {
      return;
    }

    const writePath = "./test-result";
    const image = await jimp.read(imagesDir + "/dice.png");
    const writtenImage = await image.writeAsync(writePath);

    expect(writtenImage).not.toBeUndefined();
    expect(fs.existsSync(writePath)).toBe(true);
    fs.unlinkSync(writePath);
  });

  it("should load from raw data", async () => {
    const image = await jimp.read(imagesDir + "/dice.png");
    const imageFromBitmap = await jimp.read({
      data: image.bitmap.data,
      width: image.getWidth(),
      height: image.getHeight(),
    });

    expect(imageFromBitmap).not.toBeUndefined();
  });

  it("should load from buffer jpeg", async () => {
    console.log("Start read");
    try {
      const image = await jimp.read(imagesDir + "/cops.jpg");
      console.log("read done");

      expect(image.getMIME()).toEqual("image/jpeg");
    } catch (e) {
      console.error("ERR", e);
    }
  });

  it("should load from buffer png", async () => {
    const image = await jimp.read(imagesDir + "/dice.png");

    expect(image.getMIME()).toEqual("image/png");
  });

  it("clones with the correct MIME type", async () => {
    const image = await jimp.read(imagesDir + "/cops.jpg");
    const clone = image.clone();

    expect(image.getMIME()).toBe(clone.getMIME());
  });

  it("clones gif with the correct MIME type", async () => {
    const image = await jimp.read(imagesDir + "/flower.gif");
    const clone = image.clone();

    expect(image.getMIME()).toBe(clone.getMIME());
  });
});

describe("hasAlpha", () => {
  it("image with no alpha", async () => {
    const image = await jimp.read(imagesDir + "/cops.jpg");

    expect(image.hasAlpha()).toBe(false);
  });

  it("image with alpha", async () => {
    const image = await jimp.read(imagesDir + "/dice.png");

    expect(image.hasAlpha()).toBe(true);
  });
});
