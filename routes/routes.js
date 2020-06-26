const express = require('express');
const routes = express.Router();

const Auth = require('../middlewares/Auth');
const Login = require('../controllers/LoginController');
const Dashboard = require('../controllers/DashboardController');
const RegisterCustomer = require('../controllers/RegisterCustomer');
const CustomerController = require('../controllers/CustomerController');
const ApiController = require('../controllers/ApiController');
const GenerateLicense = require('../controllers/GenerateLicense');

routes.get('/', Login.Index);
routes.post('/login', Login.Login);

routes.get('/dashboard', Auth, Dashboard.Dashboard);
routes.get('/register-new-customer', Auth, RegisterCustomer.Index);
routes.post('/register-new-customer', Auth, RegisterCustomer.Register);

routes.get('/customers', Auth, CustomerController.Index);
routes.get('/delete-customer/:id', Auth, CustomerController.DeleteCustomer);
routes.get('/ban/:id', Auth, CustomerController.Ban);
routes.get('/ban/:key', CustomerController.BanThis);
routes.get('/unban/:id', Auth, CustomerController.Unban);
routes.post('/codes/update/:id', Auth, CustomerController.Edit);


routes.get('/generate', Auth, GenerateLicense.Index);
routes.post('/generate_new', Auth, GenerateLicense.Generate);


routes.post('/style.css', ApiController.CheckLicense);


module.exports = routes
