"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionBank = void 0;
var env_1 = require("@chair-flight/base/env");
var errors_1 = require("@chair-flight/base/errors");
var resources = [
  "questions",
  "learningObjectives",
  "media",
  "flashcards",
  "subjects",
];
var QuestionBank = /** @class */ (function () {
  function QuestionBank(_a) {
    var questionBankName = _a.questionBankName,
      hasQuestions = _a.hasQuestions,
      hasLearningObjectives = _a.hasLearningObjectives,
      hasMedia = _a.hasMedia,
      hasFlashcards = _a.hasFlashcards;
    this.hasResourceMap = resources.reduce(function (s, r) {
      s[r] = false;
      return s;
    }, {});
    this.resourceArrays = resources.reduce(function (s, r) {
      s[r] = undefined;
      return s;
    }, {});
    this.resourceMaps = resources.reduce(function (s, r) {
      s[r] = undefined;
      return s;
    }, {});
    this.questionBankName = questionBankName;
    this.hasResourceMap.questions = hasQuestions;
    this.hasResourceMap.subjects = hasQuestions;
    this.hasResourceMap.learningObjectives = hasLearningObjectives;
    this.hasResourceMap.media = hasMedia;
    this.hasResourceMap.flashcards = hasFlashcards;
  }
  QuestionBank.prototype.getName = function () {
    return this.questionBankName;
  };
  QuestionBank.prototype.has = function (resource) {
    return this.hasResourceMap[resource];
  };
  QuestionBank.prototype.getAll = function (resource) {
    return __awaiter(this, void 0, void 0, function () {
      var urlPath, bankPath, baseApiPath, apiPath, response, json, all;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!this.has(resource)) {
              throw new errors_1.UnimplementedError(
                "QuestionBank has no ".concat(resource),
              );
            }
            if (!!this.resourceArrays[resource]) return [3 /*break*/, 3];
            urlPath = (0, env_1.getUrlPathOnServer)();
            bankPath = "/content/content-question-bank-".concat(this.getName());
            baseApiPath = "".concat(urlPath).concat(bankPath);
            apiPath = "".concat(baseApiPath, "/").concat(resource, ".json");
            return [4 /*yield*/, fetch(apiPath)];
          case 1:
            response = _a.sent();
            return [4 /*yield*/, response.json()];
          case 2:
            json = _a.sent();
            this.resourceArrays[resource] = json;
            _a.label = 3;
          case 3:
            all = this.resourceArrays[resource];
            return [2 /*return*/, all];
        }
      });
    });
  };
  QuestionBank.prototype.getSome = function (resource, ids) {
    return __awaiter(this, void 0, void 0, function () {
      var all, map_1, map;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!ids.length) {
              return [2 /*return*/, []];
            }
            if (!this.has(resource)) {
              throw new errors_1.UnimplementedError(
                "QuestionBank has no ".concat(resource),
              );
            }
            if (!!this.resourceMaps[resource]) return [3 /*break*/, 2];
            return [4 /*yield*/, this.getAll(resource)];
          case 1:
            all = _a.sent();
            map_1 = all.reduce(function (s, q) {
              s[q.id] = q;
              return s;
            }, {});
            this.resourceMaps[resource] = map_1;
            _a.label = 2;
          case 2:
            map = this.resourceMaps[resource];
            return [
              2 /*return*/,
              ids
                .map(function (id) {
                  return map[id];
                })
                .filter(Boolean),
            ];
        }
      });
    });
  };
  QuestionBank.prototype.getOne = function (resource, id) {
    return __awaiter(this, void 0, void 0, function () {
      var data;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.getSome(resource, [id])];
          case 1:
            data = _a.sent()[0];
            if (!data) {
              throw new errors_1.NotFoundError(
                "QuestionBank has no ".concat(resource, " with id ").concat(id),
              );
            }
            return [2 /*return*/, data];
        }
      });
    });
  };
  QuestionBank.prototype.preloadForStaticRender = function (_a) {
    var readFile = _a.readFile;
    return __awaiter(this, void 0, void 0, function () {
      var _this = this;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [
              4 /*yield*/,
              Promise.all(
                Object.entries(this.hasResourceMap)
                  .filter(function (_a) {
                    var has = _a[1];
                    return has;
                  })
                  .map(function (_a) {
                    var resource = _a[0];
                    return __awaiter(_this, void 0, void 0, function () {
                      var path, file, _b, _c;
                      return __generator(this, function (_d) {
                        switch (_d.label) {
                          case 0:
                            path = ""
                              .concat(
                                process.cwd(),
                                "/apps/next-app/public/content/content-question-bank-",
                              )
                              .concat(this.getName(), "/")
                              .concat(resource, ".json");
                            _c = (_b = JSON).parse;
                            return [4 /*yield*/, readFile(path, "utf-8")];
                          case 1:
                            file = _c.apply(_b, [_d.sent()]);
                            // @ts-expect-error Hard to type. Covered in tests
                            this.resourceArrays[resource] = file;
                            return [2 /*return*/];
                        }
                      });
                    });
                  }),
              ),
            ];
          case 1:
            _b.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  return QuestionBank;
})();
exports.QuestionBank = QuestionBank;
