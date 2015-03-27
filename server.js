// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/QA_DB');
var Question = require('./app/models/question')

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next) {
    console.log(req);
    console.log(res);
    console.log("Response logged");
    next();
})

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/questions')
    .get(function(req, res) {
        Question.find(function(err, questions) {
            if (err) { res.send(err) }
            res.json(questions);
        })
    })
    .post(function(req, res) {
        var question = new Question();

        question.save(function(err) {
            if (err) { res.send(err) }
            res.json({ message: "Question created!"
        })
    })
})

router.route('/questions/:question_id')
    .get(function(req, res) {
        Question.findById(req.params.question_id, function(err, question) {
            if (err) { res.send(err) };

            res.json(question);
        });
    })
    .put(function(req, res) {
        Question.findById(req.params.question_id, function(err, question) {
            if (err) { res.send(err) }

            question.text = req.body.text;
            question.edited = true;
            question.last_edited = new Date();

            question.save(function(err) {
                if (err) { res.send(err) }
                res.json({ message: "Question updated!"});
            })
        })
    })
    .delete(function(req, res) {
        Question.remove({
            _id: req.params.question_id
        }, function(err, question) {
            if (err) { res.send(err) }
            res.json({ message: "Successfully deleted question" })
        })
    })

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
