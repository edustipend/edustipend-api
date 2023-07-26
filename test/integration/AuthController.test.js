//Auth test goes here

require("dotenv");
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('../../server'); 
const models = require("../../models");
const {registerUser,resetPassword, BadResetPasswordData, badResetData} = require("../dummyData");
const { declutter } = require("../../database/migration/test");
chai.use(chaiHttp);

// describe("Test for signup", function () {
//   this.beforeAll(async function () {
//     this.timeout(0);

//     res = await chai.request(server).post("/v1/register").send(registerUser);
//   });

//   it("should be able to successfully signup a user", async function () {
//     expect(res).to.have.status(201);
//     expect(res.body.success).to.equal(true);
//     expect(res.body.message).to.equal(
//       "Registration successful, please check your email for verification link"
//     );
//   });
// });



  let res;

  describe("Test for reset password", function () {
    this.beforeAll(async function () {
      this.timeout(0);

      res = await chai.request(server).post("/v1/reset-password").send(registerUser);
    });

    it("should be able to successfully reset a user password", async function () {
      expect(res).to.have.status(201);
      expect(res.body.success).to.equal(true);
      expect(res.body.message).to.equal(
        "Please check your email for a reset password code"
      );
    });
  });

  describe('Test with no email should fail', function (){
    this.beforeAll(async function () {
      this.timeout(0);
  
      res = await chai
        .request(server)
        .post("/v1/reset-password")
        .send(BadResetPasswordData);
    });
    it("should not be able to send a bad request", async function () {
      expect(res).to.have.status(400);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.equal("Email is required");
    });
  })

  describe('Test with no name should fail', function(){
    this.beforeAll(async function(){
      this.timeout(0);
  
      res = await chai
      .request(server)
      .post('v1/reset-password')
      .send(badResetData)
    });
    it('should not be able to send a bad request', async function(){
      expect(res).to.have.status(400);
    });
  })




describe('Update Password Feature',async function() {
  it('should expect a status code 201 and a message "Password update successful."',async function() {
    const email = 'tes@gmail.com';

    let newRequest = await models.token.findOne({
      where: {
        email
      }
    });
    // const user = await models.token.findOne({ where: { email } });
    // console.log(newRequest)
    const newPassword = 'new_password123';
    const confirmPassword = 'new_password123';
    chai.request(server)
      .post('/v1/update-password')
      .send({ email, code: newRequest , password: newPassword, confirmPassword })
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal('Password update successful.');
      });
  });
});

