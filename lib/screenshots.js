// Mod by kritsada@zimpligital.com
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var debug_1 = __importDefault(require("debug"));
var electron_1 = require("electron");
var events_1 = __importDefault(require("events"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var event_1 = __importDefault(require("./event"));
var getDisplay_1 = __importDefault(require("./getDisplay"));
var padStart_1 = __importDefault(require("./padStart"));
var Screenshots = /** @class */ (function (_super) {
    __extends(Screenshots, _super);
    function Screenshots(opts) {
        var _this = _super.call(this) || this;
        // 截图窗口对象
        _this.$win = null;
        _this.$view = new electron_1.BrowserView({
            webPreferences: {
                preload: require.resolve('./preload.js'),
                nodeIntegration: false,
                contextIsolation: true,
                nativeWindowOpen: false
            }
        });
        _this.isReady = new Promise(function (resolve) {
            electron_1.ipcMain.once('SCREENSHOTS:ready', function () {
                _this.logger('SCREENSHOTS:ready');
                // _this.screenshotOk()
                // _this.screenshotCancel()
                resolve();
            });
        });
        _this.logger = (opts === null || opts === void 0 ? void 0 : opts.logger) || (0, debug_1.default)('electron-screenshots');
        _this.singleWindow = (opts === null || opts === void 0 ? void 0 : opts.singleWindow) || false;
        _this.listenIpc();
        console.log('call Screenshots::')
        _this.$view.webContents.loadURL("file://".concat(require.resolve('react-screenshots/electron/electron.html')));
        if (opts === null || opts === void 0 ? void 0 : opts.lang) {
            _this.setLang(opts.lang);
        }
        return _this;
    }
    /**
     * 开始截图
     */
    Screenshots.prototype.startCapture = function () {
        return __awaiter(this, void 0, void 0, function () {
            var display, imageUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger('startCapture');
                        display = (0, getDisplay_1.default)();
                        console.log("display", display);
                        return [4 /*yield*/, Promise.all([this.capture(display), this.isReady])];
                    case 1:
                        imageUrl = (_a.sent())[0];
                        return [4 /*yield*/, this.createWindow(display)];
                    case 2:
                        _a.sent();
                        this.$view.webContents.send('SCREENSHOTS:capture', display, imageUrl);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 结束截图
     */
    Screenshots.prototype.endCapture = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger('endCapture');
                        return [4 /*yield*/, this.reset()];
                    case 1:
                        _a.sent();
                        if (!this.$win) {
                            return [2 /*return*/];
                        }
                        // 先清除 Kiosk 模式，然后取消全屏才有效
                        this.$win.setKiosk(false);
                        this.$win.setSimpleFullScreen(false);
                        this.$win.blur();
                        this.$win.blurWebView();
                        this.$win.unmaximize();
                        this.$win.removeBrowserView(this.$view);
                        if (this.singleWindow) {
                            this.$win.hide();
                        }
                        else {
                            this.$win.destroy();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 设置语言
     */
    Screenshots.prototype.setLang = function (lang) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger('setLang', lang);
                        return [4 /*yield*/, this.isReady];
                    case 1:
                        _a.sent();
                        this.$view.webContents.send('SCREENSHOTS:setLang', lang);
                        return [2 /*return*/];
                }
            });
        });
    };
    Screenshots.prototype.reset = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // 重置截图区域
                        this.$view.webContents.send('SCREENSHOTS:reset');
                        // 保证 UI 有足够的时间渲染
                        return [4 /*yield*/, Promise.race([
                                new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, 500); }),
                                new Promise(function (resolve) { return electron_1.ipcMain.once('SCREENSHOTS:reset', function () { return resolve(); }); })
                            ])];
                    case 1:
                        // 保证 UI 有足够的时间渲染
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 初始化窗口
     */
    Screenshots.prototype.createWindow = function (display) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                    // 重置截图区域
                    return [4 /*yield*/, this.reset()
                        // 复用未销毁的窗口
                    ];
                    case 1:
                        // 重置截图区域
                        _c.sent();
                        // 复用未销毁的窗口
                        if (!this.$win || ((_b = (_a = this.$win) === null || _a === void 0 ? void 0 : _a.isDestroyed) === null || _b === void 0 ? void 0 : _b.call(_a))) {
                          this.$win = new electron_1.BrowserWindow({
                                title: 'screenshots',
                                x: display.x,
                                y: display.y,
                                width: display.width,
                                height: display.height,
                                useContentSize: true,
                                frame: false,
                                show: false,
                                autoHideMenuBar: true,
                                transparent: true,
                                // mac resizable 设置为 false 会导致页面崩溃
                                resizable: process.platform !== 'darwin',
                                movable: false,
                                // focusable: true, 否则窗口不能及时响应esc按键，输入框也不能输入
                                focusable: true,
                                /**
                                 * linux 下必须设置为false，否则不能全屏显示在最上层
                                 * mac 下设置为false，否则可能会导致程序坞不恢复问题
                                 * https://github.com/nashaofu/screenshots/issues/148
                                 */
                                // fullscreen: process.platform === 'darwin',
                                // 设为true 防止mac新开一个桌面，影响效果
                                simpleFullscreen: process.platform === 'darwin',
                                backgroundColor: '#00000000',
                                titleBarStyle: 'hidden',
                                alwaysOnTop: true,
                                enableLargerThanScreen: true,
                                skipTaskbar: true,
                                hasShadow: false,
                                paintWhenInitiallyHidden: false,
                                acceptFirstMouse: true
                            });
                            this.$win.on('show', function () {
                                var _a, _b;
                                (_a = _this.$win) === null || _a === void 0 ? void 0 : _a.focus();
                                /**
                                 * 在窗口显示时设置，防止与 fullscreen、x、y、width、height 等冲突, 导致显示效果不符合预期
                                 * mac 下不设置 kiosk 模式，https://github.com/nashaofu/screenshots/issues/148
                                 */
                                (_b = _this.$win) === null || _b === void 0 ? void 0 : _b.setKiosk(process.platform !== 'darwin');
                            });
                            this.$win.on('closed', function () {
                                _this.$win = null;
                            });
                        }
                        this.$win.setBrowserView(this.$view);
                        // 适定平台
                        if (process.platform === 'darwin') {
                            this.$win.setWindowButtonVisibility(false);
                        }
                        if (process.platform !== 'win32') {
                            this.$win.setVisibleOnAllWorkspaces(true, {
                                visibleOnFullScreen: true,
                                skipTransformProcessType: true
                            });
                        }
                        this.$win.blur();
                        this.$win.setKiosk(false);
                        if (process.platform === 'darwin') {
                            this.$win.setSimpleFullScreen(true);
                        }
                        this.$win.setBounds(display);
                        this.$view.setBounds({
                            x: 0,
                            y: 0,
                            width: display.width,
                            height: display.height
                        });
                        this.$win.show();
                        return [2 /*return*/];
                }
            });
        });
    };
    Screenshots.prototype.capture = function (display) {
        return __awaiter(this, void 0, void 0, function () {
            var sources, source;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger('SCREENSHOTS:capture');
                        return [4 /*yield*/, electron_1.desktopCapturer.getSources({
                                types: ['screen'],
                                thumbnailSize: {
                                    width: display.width,
                                    height: display.height
                                }
                            })];
                    case 1:
                        sources = _a.sent();
                        // Linux系统上，screen.getDisplayNearestPoint 返回的 Display 对象的 id
                        // 和这里 source 对象上的 display_id(Linux上，这个值是空字符串) 或 id 的中间部分，都不一致
                        // 但是，如果只有一个显示器的话，其实不用判断，直接返回就行
                        if (sources.length === 1) {
                            source = sources[0];
                        }
                        else {
                            source = sources.find(function (source) {
                                return source.display_id === display.id.toString() || source.id.startsWith("screen:".concat(display.id, ":"));
                            });
                        }
                        if (!source) {
                            this.logger("SCREENSHOTS:capture Can't find screen source. sources: %o, display: %o", sources, display);
                            throw new Error("Can't find screen source");
                        }
                        return [2 /*return*/, source.thumbnail.toDataURL()];
                }
            });
        });
    };
    /**
     * 绑定ipc时间处理
     */
    //  Screenshots.prototype.screenshotOk = function () {
    //   var _this = this;
    //   electron_1.ipcMain.once('SCREENSHOTS:ok', function (e, buffer, data) {
    //     electron_1.clipboard.clear();
    //     _this.logger('SCREENSHOTS:ok', buffer, data);
    //     var event = new event_1.default();
    //     _this.emit('ok', event, buffer, data);
    //     if (event.defaultPrevented) {
    //         return;
    //     }
    //     electron_1.clipboard.writeImage(electron_1.nativeImage.createFromBuffer(buffer));
    //     // electron_1.ipcMain.off('SCREENSHOTS:cancel')
    //     _this.endCapture();


    // });
    //  }
    //  Screenshots.prototype.screenshotCancel = function () {
    //   var _this = this;
    //   electron_1.ipcMain.once('SCREENSHOTS:cancel', function () {
    //     console.log('CANCELLLLLLL')
    //     // electron_1.clipboard.clear();
    //     // _this.reset()
    //     _this.logger('SCREENSHOTS:cancel');
    //     var event = new event_1.default();
    //     _this.emit('cancel', event);
    //     if (event.defaultPrevented) {
    //         return;
    //     }
    //     // electron_1.ipcMain.off('SCREENSHOTS:ok')
    //     _this.endCapture();
    // });
    //  }
    Screenshots.prototype.listenIpc = function () {
        var _this = this;
        /**
         * OK事件
         */
        electron_1.ipcMain.once('SCREENSHOTS:ok', function (e, buffer, data) {
            electron_1.clipboard.clear();
            _this.logger('SCREENSHOTS:ok', buffer, data);
            var event = new event_1.default();
            _this.emit('ok', event, buffer, data);
            if (event.defaultPrevented) {
                return;
            }
            electron_1.clipboard.writeImage(electron_1.nativeImage.createFromBuffer(buffer));
            _this.endCapture();
        });
        /**
         * CANCEL事件
         */
        electron_1.ipcMain.once('SCREENSHOTS:cancel', function () {
            console.log('CANCELLLLLLL')
            // electron_1.clipboard.clear();
            // _this.reset()
            _this.logger('SCREENSHOTS:cancel');
            var event = new event_1.default();
            _this.emit('cancel', event);
            if (event.defaultPrevented) {
                return;
            }
            _this.endCapture();
        });
        /**
         * SAVE事件
         */
        electron_1.ipcMain.once('SCREENSHOTS:save', function (e, buffer, data) { return __awaiter(_this, void 0, void 0, function () {
            var event, time, year, month, date, hours, minutes, seconds, milliseconds, _a, canceled, filePath;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.logger('SCREENSHOTS:save', buffer, data);
                        event = new event_1.default();
                        this.emit('save', event, buffer, data);
                        if (event.defaultPrevented || !this.$win) {
                            return [2 /*return*/];
                        }
                        time = new Date();
                        year = time.getFullYear();
                        month = (0, padStart_1.default)(time.getMonth() + 1, 2, '0');
                        date = (0, padStart_1.default)(time.getDate(), 2, '0');
                        hours = (0, padStart_1.default)(time.getHours(), 2, '0');
                        minutes = (0, padStart_1.default)(time.getMinutes(), 2, '0');
                        seconds = (0, padStart_1.default)(time.getSeconds(), 2, '0');
                        milliseconds = (0, padStart_1.default)(time.getMilliseconds(), 3, '0');
                        this.$win.setAlwaysOnTop(false);
                        return [4 /*yield*/, electron_1.dialog.showSaveDialog(this.$win, {
                                defaultPath: "".concat(year).concat(month).concat(date).concat(hours).concat(minutes).concat(seconds).concat(milliseconds, ".png")
                            })];
                    case 1:
                        _a = _b.sent(), canceled = _a.canceled, filePath = _a.filePath;
                        if (!this.$win) {
                            return [2 /*return*/];
                        }
                        this.$win.setAlwaysOnTop(true);
                        if (canceled || !filePath) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, fs_extra_1.default.writeFile(filePath, buffer)];
                    case 2:
                        _b.sent();
                        this.endCapture();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return Screenshots;
}(events_1.default));
exports.default = Screenshots;
