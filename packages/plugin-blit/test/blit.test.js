import { Jimp, mkJGD, getTestDir, expectToBeJGD } from "@jimp/test-utils";
import jpeg from "@jimp/jpeg";
import configure from "@jimp/custom";
import expectImport from "@storybook/expect";
import * as url from "url";
import blit from "../src";

const expect = expectImport.default;

const jimp = configure({ types: [jpeg], plugins: [blit] }, Jimp);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const testDir = getTestDir(__dirname);

describe("Blit over image", function () {
  this.timeout(15000);
  const targetJGD = mkJGD(
    "▴▴▴▴▸▸▸▸",
    "▴▴▴▴▸▸▸▸",
    "▴▴▴▴▸▸▸▸",
    "▴▴▴▴▸▸▸▸",
    "▾▾▾▾◆◆◆◆",
    "▾▾▾▾◆◆◆◆",
    "▾▾▾▾◆◆◆◆",
    "▾▾▾▾◆◆◆◆"
  );
  const srcJGD = mkJGD(
    "□□□□□□",
    "□▥▥▥▥□",
    "□▥■■▥□",
    "□▥■■▥□",
    "□▥▥▥▥□",
    "□□□□□□"
  );

  let targetImg;
  let srcImg; // stores the Jimp instances of the JGD images above.

  before((done) => {
    const img1 = jimp.read(targetJGD);
    const img2 = jimp.read(srcJGD);
    Promise.all([img1, img2])
      .then((images) => {
        targetImg = images[0];
        srcImg = images[1];
        done();
      })
      .catch(done);
  });

  it("blit on top, with no crop", () => {
    expectToBeJGD(
      targetImg.clone().blit(srcImg, 0, 0).getJGDSync(),
      mkJGD(
        "□□□□□□▸▸",
        "□▥▥▥▥□▸▸",
        "□▥■■▥□▸▸",
        "□▥■■▥□▸▸",
        "□▥▥▥▥□◆◆",
        "□□□□□□◆◆",
        "▾▾▾▾◆◆◆◆",
        "▾▾▾▾◆◆◆◆"
      )
    );
  });

  it("blit on middle, with no crop", () => {
    expectToBeJGD(
      targetImg.clone().blit(srcImg, 1, 1).getJGDSync(),
      mkJGD(
        "▴▴▴▴▸▸▸▸",
        "▴□□□□□□▸",
        "▴□▥▥▥▥□▸",
        "▴□▥■■▥□▸",
        "▾□▥■■▥□◆",
        "▾□▥▥▥▥□◆",
        "▾□□□□□□◆",
        "▾▾▾▾◆◆◆◆"
      )
    );
  });

  it("blit on middle, with x,y crop", () => {
    expectToBeJGD(
      targetImg.clone().blit(srcImg, 2, 2, 1, 1, 5, 5).getJGDSync(),
      mkJGD(
        "▴▴▴▴▸▸▸▸",
        "▴▴▴▴▸▸▸▸",
        "▴▴▥▥▥▥□▸",
        "▴▴▥■■▥□▸",
        "▾▾▥■■▥□◆",
        "▾▾▥▥▥▥□◆",
        "▾▾□□□□□◆",
        "▾▾▾▾◆◆◆◆"
      )
    );
  });

  it("blit on middle, with x,y,w,h crop", () => {
    expectToBeJGD(
      targetImg.clone().blit(srcImg, 2, 2, 1, 1, 4, 4).getJGDSync(),
      mkJGD(
        "▴▴▴▴▸▸▸▸",
        "▴▴▴▴▸▸▸▸",
        "▴▴▥▥▥▥▸▸",
        "▴▴▥■■▥▸▸",
        "▾▾▥■■▥◆◆",
        "▾▾▥▥▥▥◆◆",
        "▾▾▾▾◆◆◆◆",
        "▾▾▾▾◆◆◆◆"
      )
    );
  });

  it("blit partially out, on top-left", () => {
    expectToBeJGD(
      targetImg.clone().blit(srcImg, -1, -1).getJGDSync(),
      mkJGD(
        "▥▥▥▥□▸▸▸",
        "▥■■▥□▸▸▸",
        "▥■■▥□▸▸▸",
        "▥▥▥▥□▸▸▸",
        "□□□□□◆◆◆",
        "▾▾▾▾◆◆◆◆",
        "▾▾▾▾◆◆◆◆",
        "▾▾▾▾◆◆◆◆"
      )
    );
  });

  it("blit partially out, on bottom-right", () => {
    expectToBeJGD(
      targetImg.clone().blit(srcImg, 3, 3).getJGDSync(),
      mkJGD(
        "▴▴▴▴▸▸▸▸",
        "▴▴▴▴▸▸▸▸",
        "▴▴▴▴▸▸▸▸",
        "▴▴▴□□□□□",
        "▾▾▾□▥▥▥▥",
        "▾▾▾□▥■■▥",
        "▾▾▾□▥■■▥",
        "▾▾▾□▥▥▥▥"
      )
    );
  });

  it("blit alpha", async () => {
    const expectedImg = await Jimp.read(testDir + "/images/blit-alpha.png");
    const dice = await Jimp.read(testDir + "/images/dice.png");
    const image = await Jimp.read(testDir + "/images/cops.jpg");

    expect(image.blit(dice, 0, 0).bitmap.data).toEqual(expectedImg.bitmap.data);
  });

  async function createCat(catNum, len) {
    const imgHeight = 60;

    const butt = await Jimp.read(testDir + "/images/cat_butt.png");
    const head = await Jimp.read(testDir + "/images/cat_head.png");
    const fuzz = await Jimp.read(testDir + "/images/cat_fuzz.png");

    let longCat = len;
    longCat = longCat > 20 ? 20 : longCat;
    longCat = longCat <= 1 ? 1 : longCat;

    const cat =
      Math.floor(catNum * (head.bitmap.height / imgHeight)) * imgHeight;

    const newImage = await Jimp.create(
      butt.bitmap.width + head.bitmap.width + fuzz.bitmap.width * longCat,
      imgHeight,
      0x00000000
    );

    newImage.blit(butt, 0, 0, 0, cat, butt.bitmap.width, imgHeight);
    for (let i = 0; i < longCat; i++) {
      newImage.blit(
        fuzz,
        butt.bitmap.width + fuzz.bitmap.width * i,
        0,
        0,
        cat,
        fuzz.bitmap.width,
        imgHeight
      );
    }

    newImage.blit(
      head,
      butt.bitmap.width + fuzz.bitmap.width * longCat,
      0,
      0,
      cat,
      head.bitmap.width,
      imgHeight
    );

    return newImage;
  }

  it("uses src params correctly", async () => {
    const expectedSmall = await Jimp.read(
      testDir + "/images/cat-results/small-cat.png"
    );
    const small = await createCat(0.3, 1);

    expect(small.bitmap.data).toEqual(expectedSmall.bitmap.data);

    const expectedMedium = await Jimp.read(
      testDir + "/images/cat-results/medium-cat.png"
    );
    const medium = await createCat(0.6, 7);
    expect(medium.bitmap.data).toEqual(expectedMedium.bitmap.data);

    const expectedLarge = await Jimp.read(
      testDir + "/images/cat-results/large-cat.png"
    );
    const large = await createCat(0.9, 20);
    expect(large.bitmap.data).toEqual(expectedLarge.bitmap.data);
  });
});
