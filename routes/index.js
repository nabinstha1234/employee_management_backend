const express = require('express');

const userTokenRouter = require('./token.route');
const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const companyRouter = require('./company.route');
const employeeRouter = require('./employee.route');
const permissionRouter = require('./permmissions.route');
const inviteRouter = require('./invite.route');

const app = express();

app.get('/', (_, res) => {
  return res.send({
    message: 'Index route',
  });
});

app.use('/token', userTokenRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/company', companyRouter);
app.use('/employee', employeeRouter);
app.use('/permissions', permissionRouter);
app.use('/invite', inviteRouter);

module.exports = app;
