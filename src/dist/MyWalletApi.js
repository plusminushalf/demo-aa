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
exports.__esModule = true;
exports.MyWalletApi = void 0;
var ethers_1 = require("ethers");
var utils_1 = require("ethers/lib/utils");
var types_1 = require("./types");
var BaseWalletAPI_1 = require("@account-abstraction/sdk/dist/src/BaseWalletAPI");
/**
 * An implementation of the BaseWalletAPI using the MyWallet contract.
 * - contract deployer gets "entrypoint", "owner" addresses and "index" nonce
 * - owner signs requests using normal "Ethereum Signed Message" (ether's signer.signMessage())
 * - nonce method is "nonce()"
 * - execute method is "execFromEntryPoint()"
 */
var MyWalletApi = /** @class */ (function (_super) {
    __extends(MyWalletApi, _super);
    function MyWalletApi(params) {
        var _this = this;
        var _a;
        _this = _super.call(this, params) || this;
        _this.factoryAddress = params.factoryAddress;
        _this.owner = params.owner;
        _this.index = (_a = params.index) !== null && _a !== void 0 ? _a : 0;
        return _this;
    }
    MyWalletApi.prototype._getWalletContract = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!(this.walletContract == null)) return [3 /*break*/, 2];
                        _a = this;
                        _c = (_b = types_1.MyWallet__factory).connect;
                        return [4 /*yield*/, this.getWalletAddress()];
                    case 1:
                        _a.walletContract = _c.apply(_b, [_d.sent(), this.provider]);
                        _d.label = 2;
                    case 2: return [2 /*return*/, this.walletContract];
                }
            });
        });
    };
    /**
     * return the value to put into the "initCode" field, if the wallet is not yet deployed.
     * this value holds the "factory" address, followed by this wallet's information
     */
    MyWalletApi.prototype.getWalletInitCode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (this.factory == null) {
                            if (this.factoryAddress != null && this.factoryAddress !== '') {
                                this.factory = types_1.MyWalletDeployer__factory.connect(this.factoryAddress, this.provider);
                            }
                            else {
                                throw new Error('no factory to get initCode');
                            }
                        }
                        _a = utils_1.hexConcat;
                        _b = [this.factory.address];
                        _d = (_c = this.factory.interface).encodeFunctionData;
                        _e = ['deployWallet'];
                        _f = [this.entryPointAddress];
                        return [4 /*yield*/, this.owner.getAddress()];
                    case 1: return [2 /*return*/, _a.apply(void 0, [_b.concat([
                                _d.apply(_c, _e.concat([_f.concat([
                                        _g.sent(),
                                        this.index
                                    ])]))
                            ])])];
                }
            });
        });
    };
    MyWalletApi.prototype.getNonce = function () {
        return __awaiter(this, void 0, void 0, function () {
            var walletContract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkWalletPhantom()];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, ethers_1.BigNumber.from(0)];
                        }
                        return [4 /*yield*/, this._getWalletContract()];
                    case 2:
                        walletContract = _a.sent();
                        return [4 /*yield*/, walletContract.nonce()];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * encode a method call from entryPoint to our contract
     * @param target
     * @param value
     * @param data
     */
    MyWalletApi.prototype.encodeExecute = function (target, value, data) {
        return __awaiter(this, void 0, void 0, function () {
            var walletContract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getWalletContract()];
                    case 1:
                        walletContract = _a.sent();
                        return [2 /*return*/, walletContract.interface.encodeFunctionData('execFromEntryPoint', [target, value, data])];
                }
            });
        });
    };
    MyWalletApi.prototype.signRequestId = function (requestId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.owner.signMessage((0, utils_1.arrayify)(requestId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return MyWalletApi;
}(BaseWalletAPI_1.BaseWalletAPI));
exports.MyWalletApi = MyWalletApi;
