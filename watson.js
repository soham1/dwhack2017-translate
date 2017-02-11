const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
const LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');

const TEXT_TO_SPEECH_USERNAME = "1638cfd5-e21b-4edf-b999-d3abf21ef771"
const TEXT_TO_SPEECH_PASSWORD = "iUcdFtzMzDaB";

const textToSpeech = new TextToSpeechV1({
  username: TEXT_TO_SPEECH_USERNAME,
  password: TEXT_TO_SPEECH_PASSWORD
});

var translator = new LanguageTranslatorV2({
  username: 'e612a7b0-55ac-4f9a-bb8a-cac97509c6e7',
  password: 'jJGpncbeX4q8',
  url: 'https://gateway.watsonplatform.net/language-translator/api'
});

module.exports = {
  textToSpeech: textToSpeech,
  translator: translator
};
