const path = require('path');
const pathHelper = require('./util/path');

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const sequelize = require('./util/database');
const session = require('express-session');
const SequelizeDBStore = require('connect-session-sequelize')(session.Store);
const csrf = require('csurf');
const flash = require('connect-flash');
const helmet = require('helmet');

const errorController = require('./controllers/error');

const User = require('./models/user');
const Partner = require('./models/partner');
const Record = require('./models/complaint-record');
const AdditionalInfo = require('./models/additional-info');
const AdditionalInfoAfter = require('./models/additional-info-after');
const NoteAndAdvice = require('./models/node-and-advice');

//END OF IMPORTS

const app = express();
const store = new SequelizeDBStore({
  db: sequelize,
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const createComplaintRoutes = require('./routes/create-complaint');
const employeeRoutes = require('./routes/employee');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  bodyParser.json({ type: ['application/json', 'application/csp-report'] })
);
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array('photos', 8)
);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Security-Policy', 'default-src *');
  next();
});
app.use(express.static(path.join(pathHelper, 'public')));
app.use('/Images', express.static(path.join(__dirname, 'Images')));
app.use(
  session({
    secret: 'my secret',
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findByPk(req.session.user.id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  res.locals.isAdmin = req.session.isAdmin;
  next();
});

// ROUTES
app.use(employeeRoutes);
app.use(createComplaintRoutes);
app.use(authRoutes);
app.use(analyticsRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

User.hasMany(Partner);
Partner.hasMany(Record);
Record.belongsTo(Partner, { constraints: true, onDelete: 'CASCADE' });
AdditionalInfo.belongsTo(Record, { constraints: true, onDelete: 'CASCADE' });
Record.hasOne(AdditionalInfo);
AdditionalInfoAfter.belongsTo(Record, {
  constraints: true,
  onDelete: 'CASCADE',
});
Record.hasOne(AdditionalInfoAfter);
NoteAndAdvice.belongsTo(Record, { constraints: true, onDelete: 'CASCADE' });
Record.hasOne(NoteAndAdvice);

// app.use((error, req, res, next) => {
//   // res.status(error.httpStatusCode).render(...);
//   res.redirect('/500');
//   // res.status(500).render('500', {
//   //   pageTitle: 'Error!',
//   //   path: '/500',
//   //   isAuthenticated: req.session.isLoggedIn,
//   // });
// });

store.sync();
sequelize
  .sync()
  // .sync({force: true})
  .then((result) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
