"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAllFlashcardsFromFs =
  exports.readAllMediaFromFs =
  exports.readAllSubjectsFromFs =
  exports.readAllLearningObjectivesFromFs =
  exports.readAllQuestionsFromFs =
  exports.getPaths =
    void 0;
var fs = require("node:fs/promises");
var path = require("node:path");
var XLSX = require("xlsx");
var intentionallyLeftBlankPattern = /Intentionally left blank/i;
var courseNames = {
  "ATPL(A)": "ATPL_A",
  "CPL(A)": "CPL_A",
  "ATPL(H)/IR": "ATPL_H_IR",
  "ATPL(H)/VFR": "ATPL_H_VFR",
  "CPL(H)": "CPL_H",
  IR: "IR",
  "CBIR(A)": "CBIR_A",
};
var getPaths = function (_a) {
  var _b, _c, _d, _e, _f, _g, _h;
  var context = _a.context;
  var projects =
    (_c =
      (_b = context.workspace) === null || _b === void 0
        ? void 0
        : _b.projects) !== null && _c !== void 0
      ? _c
      : {};
  var nextProjectName = "next-app";
  /** i.e.: `content-question-bank-atpl` */
  var projectName =
    (_d = context.projectName) !== null && _d !== void 0 ? _d : "";
  /** i.e.: `libs/content/question-bank-atpl` */
  var contentRoot =
    (_f =
      (_e = projects[projectName]) === null || _e === void 0
        ? void 0
        : _e.root) !== null && _f !== void 0
      ? _f
      : "";
  /** i.e.: `libs/content/question-bank-atpl/content/media` */
  var mediaPath = path.join(contentRoot, "media");
  /** i.e.: `apps/next-app */
  var outputProject =
    (_h =
      (_g = projects[nextProjectName]) === null || _g === void 0
        ? void 0
        : _g.root) !== null && _h !== void 0
      ? _h
      : "";
  /** i.e.: `apps/next-app/public/content/question-bank-atpl` */
  var outputDir = path.join(outputProject, "public", "content", projectName);
  return {
    /** i.e.: `content-question-bank-atpl` */
    projectName: projectName,
    /** i.e.: `libs/content/question-bank-atpl` */
    questionsFolder: path.join(contentRoot, "questions"),
    /** i.e.: `libs/content/question-bank-atpl/content/flashcards` */
    flashCardsFolder: path.join(contentRoot, "flashcards"),
    /** i.e.: `libs/content/question-bank-atpl/content/media` */
    mediaPath: path.join(contentRoot, "media"),
    /** i.e.: `libs/content/question-bank-atpl/content/media/media.json` */
    mediaJson: path.join(mediaPath, "media.json"),
    /** i.e.: `libs/content/question-bank-atpl/content/subjects/subjects.json` */
    subjectsJson: path.join(contentRoot, "subjects", "subjects.json"),
    /** i.e.: `libs/content/question-bank-atpl/content/subjects/tk-syllabus.xlsx` */
    losXlsx: path.join(contentRoot, "subjects", "tk-syllabus.xlsx"),
    /** i.e.: `apps/next-app/public/content/question-bank-atpl` */
    outputDir: outputDir,
    /** i.e.: `apps/next-app/public/content/question-bank-atpl/questions.json` */
    outputQuestionsJson: path.join(outputDir, "questions.json"),
    /** i.e.: `apps/next-app/public/content/question-bank-atpl/media` */
    outputMediaDir: path.join(outputDir, "media"),
    /** i.e.: `apps/next-app/public/content/question-bank-atpl/media.json` */
    outputMediaJson: path.join(outputDir, "media.json"),
    /** i.e.: `apps/next-app/public/content/question-bank-atpl/subjects.json` */
    outputSubjectsJson: path.join(outputDir, "subjects.json"),
    /** i.e.: `apps/next-app/public/content/question-bank-atpl/learningObjectives.json` */
    outputLosJson: path.join(outputDir, "learningObjectives.json"),
    /** i.e.: `apps/next-app/public/content/question-bank-atpl/flashcards.json` */
    outputFlashcardsJson: path.join(outputDir, "flashcards.json"),
  };
};
exports.getPaths = getPaths;
var readAllQuestionsFromFs = function (_a) {
  var questionsPath = _a.questionsPath,
    skipQuestions = _a.skipQuestions,
    projectName = _a.projectName;
  return __awaiter(void 0, void 0, void 0, function () {
    var files, questions, _loop_1, _i, files_1, file;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (skipQuestions) return [2 /*return*/, []];
          return [4 /*yield*/, fs.readdir(questionsPath)];
        case 1:
          files = _b.sent();
          questions = [];
          _loop_1 = function (file) {
            var filePath, _c, _d, _e, json, jsonData, jsonDataWithSrcLocation;
            return __generator(this, function (_f) {
              switch (_f.label) {
                case 0:
                  filePath = path.join(questionsPath, file);
                  return [4 /*yield*/, fs.stat(filePath)];
                case 1:
                  if (!_f.sent().isDirectory()) return [3 /*break*/, 3];
                  _d = (_c = questions.push).apply;
                  _e = [questions];
                  return [
                    4 /*yield*/,
                    (0, exports.readAllQuestionsFromFs)({
                      questionsPath: filePath,
                      skipQuestions: skipQuestions,
                      projectName: projectName,
                    }),
                  ];
                case 2:
                  _d.apply(_c, _e.concat([_f.sent()]));
                  return [3 /*break*/, 5];
                case 3:
                  if (!(path.extname(filePath) === ".json"))
                    return [3 /*break*/, 5];
                  return [4 /*yield*/, fs.readFile(filePath, "utf-8")];
                case 4:
                  json = _f.sent();
                  jsonData = JSON.parse(json);
                  jsonDataWithSrcLocation = jsonData.map(function (q) {
                    return __assign(__assign({}, q), {
                      srcLocation: filePath.replace(process.cwd(), ""),
                    });
                  });
                  jsonDataWithSrcLocation.forEach(function (q) {
                    Object.keys(q.variants).forEach(function (id) {
                      q.variants[id].annexes = q.variants[id].annexes.map(
                        function (a) {
                          return a.replace(
                            "/content/media",
                            "/content/".concat(projectName, "/media"),
                          );
                        },
                      );
                    });
                  });
                  questions.push.apply(questions, jsonDataWithSrcLocation);
                  _f.label = 5;
                case 5:
                  return [2 /*return*/];
              }
            });
          };
          (_i = 0), (files_1 = files);
          _b.label = 2;
        case 2:
          if (!(_i < files_1.length)) return [3 /*break*/, 5];
          file = files_1[_i];
          return [5 /*yield**/, _loop_1(file)];
        case 3:
          _b.sent();
          _b.label = 4;
        case 4:
          _i++;
          return [3 /*break*/, 2];
        case 5:
          return [2 /*return*/, questions];
      }
    });
  });
};
exports.readAllQuestionsFromFs = readAllQuestionsFromFs;
var readAllLearningObjectivesFromFs = function (_a) {
  var questions = _a.questions,
    loPath = _a.loPath,
    skipLearningObjectives = _a.skipLearningObjectives;
  return __awaiter(void 0, void 0, void 0, function () {
    var workbook, sheetNames, learningObjectivesMap, learningObjectives;
    return __generator(this, function (_b) {
      if (skipLearningObjectives) return [2 /*return*/, []];
      workbook = XLSX.readFile(loPath);
      sheetNames = workbook.SheetNames;
      learningObjectivesMap = sheetNames
        .slice(2)
        .flatMap(function (name) {
          var sheet = XLSX.utils.sheet_to_json(workbook.Sheets[name]);
          return sheet.map(function (row) {
            var _a, _b, _c, _d, _e;
            var text = (
              (_a = row["2020 syllabus text"]) !== null && _a !== void 0
                ? _a
                : ""
            )
              .replaceAll(":", ":\n- ")
              .replaceAll(";", ";\n- ")
              .replace(/\b[A-Z]+\b/g, function (match) {
                return match.charAt(0) + match.slice(1).toLowerCase();
              })
              .split("Remark:")[0];
            var id =
              (_e =
                (_d =
                  (_c =
                    (_b = row["2020 syllabus reference"]) === null ||
                    _b === void 0
                      ? void 0
                      : _b.replaceAll(".00", "")) === null || _c === void 0
                    ? void 0
                    : _c.replaceAll(" 00", "")) === null || _d === void 0
                  ? void 0
                  : _d.trim()) !== null && _e !== void 0
                ? _e
                : "";
            return {
              id: id,
              courses: Object.keys(courseNames)
                .filter(function (item) {
                  return row[item];
                })
                .map(function (k) {
                  return courseNames[k];
                }),
              questions: [],
              text: text,
              contentId: id,
              // some sources are just 0 (?)... ignore those!
              source: row["Source / Comment"] || "",
              // TODO - add href
              href: "",
            };
          });
        })
        .filter(function (lo) {
          return !intentionallyLeftBlankPattern.test(lo.text);
        })
        .reduce(function (s, k) {
          if (!k.contentId) return s;
          s[k.contentId] = k;
          return s;
        }, {});
      // Populate questions
      questions.forEach(function (q) {
        var _a;
        ((_a = q.learningObjectives) !== null && _a !== void 0
          ? _a
          : []
        ).forEach(function (lo) {
          if (learningObjectivesMap[lo]) {
            learningObjectivesMap[lo].questions = __spreadArray(
              [],
              new Set(
                __spreadArray(
                  __spreadArray([], learningObjectivesMap[lo].questions, true),
                  [q.id],
                  false,
                ),
              ),
              true,
            );
          }
        });
      });
      learningObjectives = Object.values(learningObjectivesMap);
      // Bubble up learning Objectives
      learningObjectives.forEach(function (lo) {
        learningObjectives.forEach(function (lo2) {
          if (lo2.id.startsWith(lo.id)) {
            lo.courses = __spreadArray(
              [],
              new Set(
                __spreadArray(
                  __spreadArray([], lo.courses, true),
                  lo2.courses,
                  true,
                ),
              ),
              true,
            );
          }
        });
      });
      return [2 /*return*/, learningObjectives];
    });
  });
};
exports.readAllLearningObjectivesFromFs = readAllLearningObjectivesFromFs;
var readAllSubjectsFromFs = function (_a) {
  var learningObjectives = _a.learningObjectives,
    subjectsPath = _a.subjectsPath,
    skipSubjects = _a.skipSubjects;
  return __awaiter(void 0, void 0, void 0, function () {
    var fileBuffer, subjects;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (skipSubjects) return [2 /*return*/, []];
          return [4 /*yield*/, fs.readFile(subjectsPath, "utf-8")];
        case 1:
          fileBuffer = _b.sent();
          subjects = JSON.parse(fileBuffer);
          return [
            2 /*return*/,
            learningObjectives.reduce(
              function (acc, lo) {
                var _a, _b, _c, _d;
                var path = lo.id.split(".").map(function (_, index, arr) {
                  return arr.slice(0, index + 1).join(".");
                });
                var subject = acc.find(function (s) {
                  var key = path[0] === "071" ? "070" : path[0];
                  return s.id === key;
                });
                var chapter =
                  (_a =
                    subject === null || subject === void 0
                      ? void 0
                      : subject.children) === null || _a === void 0
                    ? void 0
                    : _a.find(function (c) {
                        return path[1].startsWith(c.id);
                      });
                var section =
                  (_b =
                    chapter === null || chapter === void 0
                      ? void 0
                      : chapter.children) === null || _b === void 0
                    ? void 0
                    : _b.find(function (s) {
                        return path[2].startsWith(s.id);
                      });
                if (!subject || path.length === 1) return acc;
                if (path.length === 2) {
                  subject.numberOfQuestions += lo.questions.length;
                  (_c = subject.children) !== null && _c !== void 0
                    ? _c
                    : (subject.children = []);
                  subject.children.push({
                    id: lo.id,
                    text: lo.text,
                    numberOfQuestions: lo.questions.length,
                    numberOfLearningObjectives: 0,
                    children: [],
                  });
                  return acc;
                }
                if (!chapter)
                  throw new Error("Chapter not found: ".concat(path[1]));
                if (path.length === 3) {
                  subject.numberOfQuestions += lo.questions.length;
                  chapter.numberOfQuestions += lo.questions.length;
                  (_d = chapter.children) !== null && _d !== void 0
                    ? _d
                    : (chapter.children = []);
                  chapter.children.push({
                    id: lo.id,
                    text: lo.text,
                    numberOfQuestions: lo.questions.length,
                    numberOfLearningObjectives: 0,
                    children: [],
                  });
                  return acc;
                }
                if (!section)
                  throw new Error("Section not found: ".concat(path[2]));
                subject.numberOfLearningObjectives += 1;
                chapter.numberOfLearningObjectives += 1;
                section.numberOfLearningObjectives += 1;
                subject.numberOfQuestions += lo.questions.length;
                chapter.numberOfQuestions += lo.questions.length;
                section.numberOfQuestions += lo.questions.length;
                return acc;
              },
              subjects.map(function (s) {
                var _a;
                return __assign(__assign({}, s), {
                  numberOfQuestions: 0,
                  numberOfLearningObjectives: 0,
                  children:
                    (_a = s.children) !== null && _a !== void 0 ? _a : [],
                });
              }),
            ),
          ];
      }
    });
  });
};
exports.readAllSubjectsFromFs = readAllSubjectsFromFs;
var readAllMediaFromFs = function (_a) {
  var questions = _a.questions,
    mediaPath = _a.mediaPath,
    skipMedia = _a.skipMedia;
  return __awaiter(void 0, void 0, void 0, function () {
    var file, json, allMedia;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (skipMedia) return [2 /*return*/, []];
          return [4 /*yield*/, fs.readFile(mediaPath, "utf-8")];
        case 1:
          file = _b.sent();
          json = JSON.parse(file);
          allMedia = json.map(function (m) {
            return __assign(__assign({}, m), {
              questions: [],
              variants: [],
              learningObjectives: [],
            });
          });
          // connect questions to media
          questions.forEach(function (q) {
            Object.values(q.variants).forEach(function (v) {
              v.annexes.forEach(function (a) {
                var _a, _b;
                var annex =
                  (_b =
                    (_a = a.split("/").pop()) === null || _a === void 0
                      ? void 0
                      : _a.split(".")[0]) !== null && _b !== void 0
                    ? _b
                    : "";
                var media = allMedia.find(function (m) {
                  return m.id === annex;
                });
                if (media) {
                  media.questions = __spreadArray(
                    [],
                    new Set(
                      __spreadArray(
                        __spreadArray([], media.questions, true),
                        [q.id],
                        false,
                      ),
                    ),
                    true,
                  );
                  media.variants = __spreadArray(
                    [],
                    new Set(
                      __spreadArray(
                        __spreadArray([], media.variants, true),
                        [v.id],
                        false,
                      ),
                    ),
                    true,
                  );
                  media.learningObjectives = __spreadArray(
                    [],
                    new Set(
                      __spreadArray(
                        __spreadArray([], media.learningObjectives, true),
                        q.learningObjectives,
                        true,
                      ),
                    ),
                    true,
                  );
                }
              });
            });
          });
          return [2 /*return*/, allMedia];
      }
    });
  });
};
exports.readAllMediaFromFs = readAllMediaFromFs;
var readAllFlashcardsFromFs = function (_a) {
  var flashCardsPath = _a.flashCardsPath,
    skipFlashcards = _a.skipFlashcards;
  return __awaiter(void 0, void 0, void 0, function () {
    var flashcardFiles,
      flashcards,
      _i,
      flashcardFiles_1,
      file,
      filePath,
      jsonString,
      jsonData;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (skipFlashcards) return [2 /*return*/, []];
          return [4 /*yield*/, fs.readdir(flashCardsPath)];
        case 1:
          flashcardFiles = _b.sent();
          flashcards = [];
          (_i = 0), (flashcardFiles_1 = flashcardFiles);
          _b.label = 2;
        case 2:
          if (!(_i < flashcardFiles_1.length)) return [3 /*break*/, 5];
          file = flashcardFiles_1[_i];
          filePath = path.join(flashCardsPath, file);
          return [4 /*yield*/, fs.readFile(filePath, "utf-8")];
        case 3:
          jsonString = _b.sent();
          jsonData = JSON.parse(jsonString);
          flashcards.push({
            id: file.replace(".json", ""),
            flashcards: jsonData,
            title: file
              .replace(".json", "")
              .split("-")
              .map(function (s) {
                return s[0].toUpperCase() + s.slice(1);
              })
              .join(" "),
          });
          _b.label = 4;
        case 4:
          _i++;
          return [3 /*break*/, 2];
        case 5:
          return [2 /*return*/, flashcards];
      }
    });
  });
};
exports.readAllFlashcardsFromFs = readAllFlashcardsFromFs;
