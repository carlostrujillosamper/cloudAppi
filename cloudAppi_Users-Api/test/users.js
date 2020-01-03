const mongoose = require("mongoose");
const User = require('../models/User');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();


chai.use(chaiHttp);

describe('Users', () => {
    beforeEach((done) => {
        User.remove({}, (err) => { 
           done();           
        });        
    });
  describe('/GET user', () => {
      it('it should GET all users', (done) => {
            chai.request(server)
            .get('/users/getusers')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.schema.should.be.a('array');
                  res.body.schema.length.should.be.eql(0);
              done();
            });
      });
  });
  describe('/POST user', () => {
 
      it('it should POST a user ', (done) => {
          let user = {
              name: "Name",
              email:"email",
              birthDate:"12-12-1985"
          }
            chai.request(server)
            .post('/users/createUsers')
            .buffer(true)
            .send(user)
            .end((err, res) => {
                  
                  res.should.have.status(201);
                  res.body.should.be.a('object');
                  res.body.schema.should.have.property('name');
                  res.body.schema.should.have.property('email');
                  res.body.schema.should.have.property('birthDate');
              done();
            });
      });
  });
  describe('/GET/:id user', () => {
      it('it should GET a user by the given id', (done) => {
          let user = new User({ name: "name", email: "email", birthDate:"12-12-1985" });
          user.save((err, user) => {
              chai.request(server)
            .get('/users/getusersById/' + user.id)
            .send(user)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.schema.should.have.property('name');
                  res.body.schema.should.have.property('email');
                  res.body.schema.should.have.property('birthDate');
                  res.body.schema.should.have.property('_id').eql(user.id);
              done();
            });
          });

      });
  });
  describe('/PUT/:id user', () => {
      it('it should UPDATE a user given the id', (done) => {
          let user = new User({name: "name", email: "email", birthDate:"12-12-1985"})
          user.save((err, user) => {
                chai.request(server)
                .put('/users/updateUsersById/' + user.id)
                .send({name: "namesss", email: "emailsss", birthDate:"12-12-1986"})
                .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.schema.should.have.property('email').eql("emailsss");
                  done();
                });
          });
      });
  });
 /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id user', () => {
      it('it should DELETE a user given the id', (done) => {
          let user = new User({name: "The Chronicles of Narnia", email: "email", birthDate:"12-12-1985"})
          user.save((err, user) => {
                chai.request(server)
                .delete('/users/deleteUsersById/' + user.id)
                .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                  done();
                });
          });
      });
  });
});