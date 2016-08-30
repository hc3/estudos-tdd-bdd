import supertest from 'supertest';
import chai from 'chai';
import Joi from 'Joi';
import joiAssert from 'joi-Assert';
import app from '../../app';

global.app = app;
global.request = supertest(app);
global.expect = chai.expect;
global.Joi = Joi;
global.joiAssert = joiAssert;
