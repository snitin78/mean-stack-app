require('./instantHello');
var goodbye = require("./talk/goodbye");
var talk = require("./talk");
var question = require("./talk/question");

talk.intro();
talk.hello("Nitin");

console.log(question.ask("What is the meaning of life?"));
goodbye();