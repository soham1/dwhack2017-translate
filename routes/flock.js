var express = require('express');
var router = express.Router();
var fs = require('fs');

function getUserInstallEventData(userId) {
  var fileName = __dirname + "/../users/" + userId;
  var contents = fs.readFileSync(fileName, 'utf8');
  return JSON.parse(contents);
}

router.get('/speech', function(req, res, next) {
  var token = getUserInstallEventData(res.locals.eventTokenPayload.userId).userToken;
  var messageUid = JSON.parse(req.query.flockEvent).messageUids.messageUid;
  console.log("token", token);
  console.log("messageUid", messageUid);
  req.flock.callMethod('chat.fetchMessages', token, {
    chat: JSON.parse(req.query.flockEvent).chat,
    uids: [messageUid]
  }, function(error, response) {
    if (error) {
      console.log("ERROR");
    } else {
      res.render("translate-speech.ejs", {text: response[0].text});
    }  
  });
});

router.get('/audio', function(req, res, next){
  console.log("Form BODY", req.query);

      var speechParam =  { text: req.query.text, voice: req.query.languages, action: '' };
      console.log(speechParam);
      const transcript = req.watson.textToSpeech.synthesize(speechParam);
      transcript.on('response', function(response){
        console.log("IN RESPONSE");
        if (req.query.download == "true") {
          if (req.query.accept && req.query.accept === 'audio/wav') {
            console.log("ON TOP");
            response.headers['content-disposition'] = 'attachment; filename=transcript.wav';
          }
          else {
            console.log("ON BOTTOM");
            response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
          }
        }
      });
      transcript.on('error', next);
      transcript.pipe(res);
    });

router.post('/event', function(req, res, next) {
  console.log("Request body", req.body);
  console.log("Token", res.locals);
  if (req.body.name == "client.slashCommand") {
    try {
      var languages = {
        french: "en-fr-conversational",
        arabic: "en-ar-conversational",
        spanish: "en-es-conversational",
        portuguese: "en-pt-conversational"
      };
      var text = req.body.text;
      var splitted = text.split(" ");
      var language = splitted[0].toLowerCase();
      splitted.shift();
      var text_final = splitted.join(" ");
      var translate_params = {
        'X-WDC-PL-OPT-OUT': '0',
        model_id: languages[language],
        text: text_final
      };
      req.watson.translator.translate(translate_params, function(err, models) {
        if (err) {
          res.json({
            "text": "Please enter language followed by text."
          });
        }
        else {
          console.log("LOCAL USER ID", res.locals.eventTokenPayload.userId);
          var token = getUserInstallEventData(res.locals.eventTokenPayload.userId).userToken;
          console.log("User token", token);
          req.flock.callMethod('chat.sendMessage', token, {
            to: req.body.chat,
            text: models.translations[0].translation
          }, function(error, response) {
            if (!error) {
              console.log(response);
            }
          });

          res.json({
            "text": models.translations[0].translation
          });
        }
      });
    }
    catch (exception) {
      console.log(exception);
    }
  }
  else if (req.body.name == 'app.install') {
    var fileName = __dirname + "/../users/" + req.body.userId;
    console.log('Saving install event in file:', fileName);
    fs.writeFile(fileName, JSON.stringify(req.body, null, 2), function(err) {
      if (err) {
        console.log('Error saving install event: ' + err);
        res.send('Error saving install event: ' + err);
      }
      else {
        console.log("The file was saved!");
        res.send('User install event is saved!');
      }
    });
  }
  else if (req.body.name == 'app.uninstall') {
    var fileName = __dirname + "/../users/" + req.body.userId;
    console.log('Deleting uninstall user file:', fileName);
    fs.unlink(fileName, function(err) {
      if (err) {
        console.log('Error deleting uninstall file: ' + err);
        res.send('Error deleting uninstall file: ' + err);
      }
      else {
        console.log("The file was deleted!");
        res.send('The file was deleted!');
      }
    });
  }
  else {
    res.send('All OK');
  }
});

router.get('/config', function(req, res, next) {
  console.log("Config body", req.body);
  res.send('Thank you for installing the app!');
});

router.get('/translate-widget', function(req, res, next) {
  res.render("translate-widget.ejs", {"userId": res.locals.eventTokenPayload.userId, "chat": JSON.parse(req.query.flockEvent).chat});
});

router.post('/translate-widget', function(req, res, next) {
  console.log(req.body);
  var conversion = req.body.from + "-" + req.body.to + "-conversational";
  var translate_params = {
    'X-WDC-PL-OPT-OUT': '0',
    model_id: conversion,
    text: req.body.text
  };
  req.watson.translator.translate(translate_params, function(err, models) {
    if (err) {
      res.json({
        "text": "Please enter language followed by text."
      });
    }
    else {
      //var locals = JSON.parse(req.body.locals);
      var userId = req.body.userId;
      res.render("translate-response.ejs", {
        "text": models.translations[0].translation,
        "token": getUserInstallEventData(userId).userToken,
        "chat": req.body.chat
      });
    }
  });
});

router.post('/send', function(req, res, next) {
   req.flock.callMethod('chat.sendMessage', req.body.token, {
     to: req.body.chat,
     text: req.body.text
    }, function(error, response) {
      if (!error) {
      }
   });

});
module.exports = router;
