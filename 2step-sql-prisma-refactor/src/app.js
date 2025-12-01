const express = require("express");
const cors = require("cors");
const helmet = require('helmet');
const morgan = require('morgan');

const { load } = require("./loader");
const AppError = require("./misc/AppError");
const { v1: apiRouter } = require("./router");
const { errorMiddleware } = require("./middleware");

const app = express();

app.set('trust proxy', true);

app.use(cors());
if(process.env.NODE_ENV == 'production') {
  app.use(morgan('combined'));
  app.use(helmet( { contentSecurityPolicy: false}));
} else {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/api', apiRouter);

app.use((_req,_res,next) => next(new AppError('Not Found', 404)));

app.use(errorMiddleware);

async function bootstrap() {
  await load();
  return app;
}

module.exports = {
  app,
  bootstrap,
};