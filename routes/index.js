const express = require("express");
const QS = require("query-string");

const SVGUtils = require("../utils/SvgUtils");
var router = express.Router();

const colors = [
  // RETRO-COOL
  "#f72585",
  "#b5179e",
  "#7209b7",
  "#560bad",
  "#480ca8",
  "#3a0ca3",
  "#3f37c9",
  "#4361ee",
  "#4895ef",
  "#4cc9f0",
  // MONOCHROME-BLUE
  "#03045e",
  "#023e8a",
  "#0077b6",
  "#0096c7",
  "#00b4d8",
  "#48cae4",
  "#90e0ef",
  "#ade8f4",
  "#caf0f8",
];

function rand_item(items = []) {
  if (!Array.isArray(items)) return null;
  return items[Math.floor(Math.random() * items.length)];
}

/* GET home page. */
router.get("/", function (req, res) {
  const color = req.query.color || rand_item(colors);
  const width = Number(req.query.width) || 1440;
  const height = Number(req.query.height) || 400;
  const step = Number(req.query.step) || 50;
  const svgPath = SVGUtils.genPath({ width, height, step });
  const svgFiles = SVGUtils.getSvgs().slice().reverse();
  res.render("index", { title: "SVG Generator", svgPath, width, height, color, svgFiles });
});

router.post("/", function (req, res) {
  // TODO: HANDLE SAVE

  // console.log(req.body);
  const { width, height, color, svgPath } = req.body;
  SVGUtils.saveSvg({ width, height, color, svgPath });
  const queryString = QS.stringify({ width, height });
  res.redirect(`/?${queryString}`);
});

module.exports = router;
