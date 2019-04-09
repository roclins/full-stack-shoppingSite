var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 登录拦截 app.use 是什么
app.use((req,res,next)=>{
  console.log(req)
  if(req.cookies.userId){
    next();
  }else{
    //取到的 originalUrl 是 /goods?id=1&name=‘jack’等等，所以不可以直接写req.originalUrl ===‘/goods’  
    // req.originalUrl.indexOf('/goods/list')>-1)  这个方式不可以
    if(req.originalUrl == '/users/login'||req.originalUrl === 'users/logout'|| req.path==='/goods/list'){
      next();
    }else{
      res.json({
        status:'10001',
        msg:'当前未登录',
        result:''
      })
    }
  }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods',goodsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
