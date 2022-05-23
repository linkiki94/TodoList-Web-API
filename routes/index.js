const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

router.get('/', function (req, res, next) {

  const isAuth = req.isAuthenticated();

  if (isAuth) {

    const userId = req.user.id;

    knex("tasks")
      .select("*")
      .where({user_id: userId})
      .then(function (results) {
        res.render('index', {
          title: 'ToDoList App',
          todos: results,
          isAuth: isAuth
        });
      })
      .catch(function (err) {
        console.error(err);
        res.render('index', {
          title: 'ToDoList App',
          isAuth: isAuth,
          errorMessage: [err.sqlMessage]
        });
      });
  } else {
    res.render('index', {
      title: 'ToDoList App',
      isAuth: isAuth
    });
  }
});

//追加機能
router.post('/add', function (req, res, next) {

  const isAuth = req.isAuthenticated();
  const userId = req.user.id;
  const todoTitle = req.body.title;
  const todoContent = req.body.content;

  knex("tasks")
    .insert({user_id: userId, title: todoTitle, content: todoContent})
    .then(function () {
      res.redirect('/')
    })
    .catch(function (err) {
      console.error(err);
      res.render('index', {
        title: 'ToDoList App',
        isAuth: isAuth,
        errorMessage: [err.sqlMessage]
      });
    });
});

//削除機能
router.post('/delete', function (req, res, next) {

  const isAuth = req.isAuthenticated();
  const userId = req.user.id;
  const id = req.body['id'];
   console.log(req.body);
  knex("tasks").delete()
    .where({id:id})
    .then(function () {
      res.redirect('/signin')
    })
    .catch(function (err) {
      console.error(err);
      res.render('index', {
        title: 'ToDoList App',
        isAuth: isAuth,
        errorMessage: [err.sqlMessage]
      });
    });
});

//更新機能
router.post('/update', function (req, res, next) {

  const isAuth = req.isAuthenticated();
  const userId = req.user.id;
  const id = req.body['id'];
  const title = req.body['title'];
  const content = req.body['content'];

  knex("tasks").update({
      title:title,
      content:content
    })
    .where({id:id})
    .then(function () {
      res.redirect('/')
    })
    .catch(function (err) {
      console.error(err);
      res.render('index', {
        title: 'ToDoList App',
        isAuth: isAuth,
        errorMessage: [err.sqlMessage]
      });
    });
});

//検索機能
router.post('/', function (req, res, next) {

    const isAuth = req.isAuthenticated();
    const userId = req.user.id;
    const select = req.body.select;

    knex("tasks")
      .select("*")
      .where({user_id: userId})
      .andWhere(function() {
          this.where('title','like','%'+select+'%').orWhere('content','like','%'+select+'%')
      })
      .then(function (results) {
          console.log(results[0]);
        res.render('index', {
          title: 'ToDoList App',
          todos: results,
          isAuth: isAuth,
        });
      })
      .catch(function (err) {
        console.error(err);
        res.render('index', {
          title: 'ToDoList App',
          todos: results,
          isAuth: isAuth,
          errorMessage: [err.sqlMessage]
        });
      });
});





router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
router.use('/logout', require('./logout'));

module.exports = router;
