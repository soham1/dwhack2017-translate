
const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');

const TEXT_TO_SPEECH_USERNAME = "1638cfd5-e21b-4edf-b999-d3abf21ef771"
const TEXT_TO_SPEECH_PASSWORD = "iUcdFtzMzDaB";

const textToSpeech = new TextToSpeechV1({
  username: TEXT_TO_SPEECH_USERNAME,
  password: TEXT_TO_SPEECH_PASSWORD
});


module.exports = {
  textToSpeech: textToSpeech
};

