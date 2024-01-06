"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionBanks = void 0;
var question_bank_1 = require("./question-bank");
var QuestionBankB737 = new question_bank_1.QuestionBank({
  questionBankName: "b737",
  hasQuestions: true,
  hasLearningObjectives: false,
  hasMedia: false,
  hasFlashcards: false,
});
var QuestionBankA320 = new question_bank_1.QuestionBank({
  questionBankName: "a320",
  hasQuestions: true,
  hasLearningObjectives: false,
  hasMedia: false,
  hasFlashcards: false,
});
var QuestionBankAtpl = new question_bank_1.QuestionBank({
  questionBankName: "atpl",
  hasQuestions: true,
  hasLearningObjectives: true,
  hasMedia: true,
  hasFlashcards: false,
});
var QuestionBankPrep = new question_bank_1.QuestionBank({
  questionBankName: "prep",
  hasQuestions: false,
  hasLearningObjectives: false,
  hasMedia: false,
  hasFlashcards: true,
});
exports.questionBanks = {
  b737: QuestionBankB737,
  a320: QuestionBankA320,
  atpl: QuestionBankAtpl,
  prep: QuestionBankPrep,
};
