var express = require('express');
var router = express.Router();

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
          req.flock.callMethod('chat.sendMessage', res.locals.appId, {
            to: res.locals.userId,
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
  else {
    res.json({
      "text": "Please enter language followed by text."
    });
  }
});

router.get('/config', function(req, res, next) {
  console.log("Config body", req.body);
  res.send('Thank you for installing the app!');
});

router.get('/translate-widget', function(req, res, next) {
  res.render("translate-widget.ejs");
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
          console.log(req.flock);
            res.render("translate-response.ejs", {
            "text": models.translations[0].translation 
          });
        }
      });
});

module.exports = router;
