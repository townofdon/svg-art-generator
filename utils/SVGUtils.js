const SvgPath = require("svg-path-generator");
const ejs = require("ejs");

// const { noise2 } = require("../lib/noisejs/perlin");

const { noise, noiseSeed } = require("../utils/noise");
const { FileSystem } = require("./FileSystem");

const WIDTH = 300;
const HEIGHT = 150;
const STEP = 50;
const SVG_PATH = "/public/svg";
const SVG_TEMPLATE = "/templates/svg.ejs";

const SVGUtils = {
  //
  // GET A PATH FROM A SET OF POINTS
  //
  _toPath(
    points = [0],
    options = {
      width: WIDTH,
      height: HEIGHT,
      step: STEP,
    }
  ) {
    const { width = WIDTH, height = HEIGHT, step = STEP } = options;
    const path = SvgPath().moveTo(0, height);
    for (var i = 0; i < width + step; i += step) {
      const x = Math.floor((i * points.length) / width);
      const y = points[x] || points[points.length - 1];
      path.lineTo(x, height * (1 - y));
    }
    // close off mountain path
    path.lineTo(width, height).lineTo(0, height).end();
    return String(path);
  },
  //
  // GENERATE AN ARRAY OF POINTS
  //
  _genPoints(
    options = {
      width: WIDTH,
    }
  ) {
    const { width = WIDTH } = options;
    noiseSeed();
    // noise2.seed(Math.random());
    const points = [];
    for (let x = 0; x < width; x += 1) {
      const val = noise(x / 100);
      // const val = (noise2.perlin2(x / 200, 0) + 1) / 2;
      points.push(val);
    }
    return points;
  },
  //
  // GENERATE AN SVG PATH
  //
  genPath(
    options = {
      width: WIDTH,
      height: HEIGHT,
      step: STEP,
    }
  ) {
    const { width = WIDTH, height = HEIGHT, step = STEP } = options;
    const points = SVGUtils._genPoints({ width });
    const path = SVGUtils._toPath(points, { width, height, step });
    return String(path);
  },
  //
  // SAVE AN SVG FILE
  //
  saveSvg({ width, height, color, svgPath } = {}) {
    const files = FileSystem.getDirectoryFiles(SVG_PATH);
    let maxNum = 0;
    // DETERMINE HIGHEST NUMBER FROM EXISTING FILES
    files.forEach((file) => {
      const searchReg = /.*-(\d+)\.svg$/;
      const match = file.match(searchReg);
      if (!match || !match.length) return;
      const fileNum = Number(match[1]);
      if (fileNum >= maxNum) maxNum = fileNum + 1;
    });
    const fileName = `mountains-${String(maxNum).padStart(2, "0")}.svg`;
    const filePath = `${SVG_PATH}/${fileName}`;
    const template = FileSystem.readFile(SVG_TEMPLATE);
    let content = ejs.render(template, { width, height, color, svgPath, index: maxNum });
    FileSystem.writeFile(filePath, content);
  },
  //
  // GET SVG FILES
  //
  getSvgs() {
    const fileNames = FileSystem.getDirectoryFiles(SVG_PATH);
    const files = fileNames.map((fileName) => FileSystem.readFile(SVG_PATH + "/" + fileName));
    return files;
  },
};

module.exports = SVGUtils;
