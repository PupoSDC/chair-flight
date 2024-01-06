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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("node:fs/promises");
var path = require("node:path");
var parse_question_bank_1 = require("../common/parse-question-bank");
var runExecutor = function (options, context) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a,
      projectName,
      questionsFolder,
      flashCardsFolder,
      mediaPath,
      mediaJson,
      subjectsJson,
      losXlsx,
      outputDir,
      outputQuestionsJson,
      outputMediaDir,
      outputMediaJson,
      outputSubjectsJson,
      outputLosJson,
      outputFlashcardsJson,
      questions,
      learningObjectives,
      subjects,
      media,
      flashcards;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          (_a = (0, parse_question_bank_1.getPaths)({ context: context })),
            (projectName = _a.projectName),
            (questionsFolder = _a.questionsFolder),
            (flashCardsFolder = _a.flashCardsFolder),
            (mediaPath = _a.mediaPath),
            (mediaJson = _a.mediaJson),
            (subjectsJson = _a.subjectsJson),
            (losXlsx = _a.losXlsx),
            (outputDir = _a.outputDir),
            (outputQuestionsJson = _a.outputQuestionsJson),
            (outputMediaDir = _a.outputMediaDir),
            (outputMediaJson = _a.outputMediaJson),
            (outputSubjectsJson = _a.outputSubjectsJson),
            (outputLosJson = _a.outputLosJson),
            (outputFlashcardsJson = _a.outputFlashcardsJson);
          return [
            4 /*yield*/,
            (0, parse_question_bank_1.readAllQuestionsFromFs)(
              __assign(
                { questionsPath: questionsFolder, projectName: projectName },
                options,
              ),
            ),
          ];
        case 1:
          questions = _b.sent();
          return [
            4 /*yield*/,
            (0, parse_question_bank_1.readAllLearningObjectivesFromFs)(
              __assign({ questions: questions, loPath: losXlsx }, options),
            ),
          ];
        case 2:
          learningObjectives = _b.sent();
          return [
            4 /*yield*/,
            (0, parse_question_bank_1.readAllSubjectsFromFs)(
              __assign(
                {
                  learningObjectives: learningObjectives,
                  subjectsPath: subjectsJson,
                },
                options,
              ),
            ),
          ];
        case 3:
          subjects = _b.sent();
          return [
            4 /*yield*/,
            (0, parse_question_bank_1.readAllMediaFromFs)(
              __assign({ questions: questions, mediaPath: mediaJson }, options),
            ),
          ];
        case 4:
          media = _b.sent();
          return [
            4 /*yield*/,
            (0, parse_question_bank_1.readAllFlashcardsFromFs)(
              __assign({ flashCardsPath: flashCardsFolder }, options),
            ),
          ];
        case 5:
          flashcards = _b.sent();
          return [
            4 /*yield*/,
            fs
              .rm(path.join(process.cwd(), outputDir), { recursive: true })
              .catch(function () {}),
          ];
        case 6:
          _b.sent();
          return [
            4 /*yield*/,
            fs.mkdir(path.join(process.cwd(), outputDir), { recursive: true }),
          ];
        case 7:
          _b.sent();
          return [
            4 /*yield*/,
            Promise.all([
              fs.writeFile(
                path.join(process.cwd(), outputQuestionsJson),
                JSON.stringify(questions),
              ),
              fs.writeFile(
                path.join(process.cwd(), outputLosJson),
                JSON.stringify(learningObjectives),
              ),
              fs.writeFile(
                path.join(process.cwd(), outputSubjectsJson),
                JSON.stringify(subjects),
              ),
              fs.writeFile(
                path.join(process.cwd(), outputMediaJson),
                JSON.stringify(media),
              ),
              fs.writeFile(
                path.join(process.cwd(), outputFlashcardsJson),
                JSON.stringify(flashcards),
              ),
              options.skipMedia
                ? Promise.resolve()
                : fs.cp(
                    path.join(process.cwd(), mediaPath),
                    path.join(process.cwd(), outputMediaDir),
                    { recursive: true },
                  ),
            ]),
          ];
        case 8:
          _b.sent();
          return [
            2 /*return*/,
            {
              success: true,
            },
          ];
      }
    });
  });
};
exports.default = runExecutor;
