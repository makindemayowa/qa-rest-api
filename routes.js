const express = require('express');
const Question = require('./models').Question

const router = express.Router();

router.param('qId', (req, res, next, id) => {
  Question.findById(id, (err, question) => {
    if (err) return next(err);
    if (!question) {
      const error = new Error('No question found')
      error.status = 404;
      return next(err);
    }
    req.question = question;
    return next();
  })
})

router.param('aId', (req, res, next, id) => {
  req.answer = req.question.answers.id(id);
  if (!req.answer) {
    const error = new Error('No question found')
    error.status = 404;
    return next(error);
  }
  next();
})

router.get('/', (req, res, next) => {
  Question.find({}, null, { sort: { createdAt: -1 } }, (err, questions) => {
    if (err) return next(err);
    res.json(questions)
  })
})

router.post('/', (req, res, next) => {
  const question = new Question(req.body);
  question.save((err, questions) => {
    if (err) return next(err);
    res.json(questions)
  })
})

router.get('/:qId', (req, res) => {
  res.json(req.question)
})

router.post('/:qId/answers', (req, res) => {
  req.question.answers.push(req.body);
  req.question.save((err, question) => {
    if (err) return next(err);
    res.status(201);
    res.json(question)
  })
})

router.put('/:qId/answers/:aId', (req, res) => {
  req.answer.update(req.body, (err, result) => {
    if (err) return next(err);
    res.json(result)
  })
})

router.delete('/:qId/answers/:aId', (req, res) => {
  req.answer.remove((err, result) => {
    req.question.save((error, question) => {
      if (error) return next(error);
      res.json(question)
    })
  })
})

router.post('/:qId/answers/:aId/vote-:dir', (req, res, next) => {
  if (req.params.dir !== 'up' && req.params.dir !== 'down') {
    err = new Error('route not found')
    err.status = 400;
    next(err)
  }
  next()
},
  (req, res) => {
    req.answer.vote(req.params.dir, (err, question) => {
      if (err) return next(err);
      res.json(question)
    })
  })

module.exports = router;

