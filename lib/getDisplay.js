"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
exports.default = (function () {
    var point = electron_1.screen.getCursorScreenPoint();
    var displays = electron_1.screen.getAllDisplays();
    // console.log(displays, point)
    var _a = electron_1.screen.getDisplayNearestPoint(point), id = _a.id, bounds = _a.bounds;
    // https://github.com/nashaofu/screenshots/issues/98
  //   return {
  //     id: 2,
  //     x: Math.floor(-1920),
  //     y: Math.floor(-69),
  //     width: Math.floor(1920),
  //     height: Math.floor(1080)
  // };

    return {
        id: id,
        x: Math.floor(bounds.x),
        y: Math.floor(bounds.y),
        width: Math.floor(bounds.width),
        height: Math.floor(bounds.height)
    };
});
