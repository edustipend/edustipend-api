require("dotenv");

const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;
const server = require("../../server");
const models = require("../../models");
const {
  completeStipendRequestData,
  incompleteStipendRequestData,
  badStipendRequestDataType,
  anotherCompleteStipendRequestData,
  approvedUser,
  registerUser
} = require("../dummyData");
const { declutter } = require("../../database/migration/test");

describe("Test for Stipend Request", function () {
  this.beforeAll(async function () {
    this.timeout(0);
    await declutter();
  });

  let res;
  let firstRequestId;

  describe("Test for sending stipend request", function () {
    this.beforeAll(async function () {
      this.timeout(0);

      res = await chai
        .request(server)
        .post("/v1/user/request-stipend")
        .send(completeStipendRequestData);
    });
    it("should be able to successfully send a good request", async function () {
      expect(res).to.have.status(201);
      expect(res.body.success).to.equal(true);
      expect(res.body.message).to.equal("Request successfully created");
    });
  });

  describe("Stipend request with incomplete data should fail", function () {
    this.beforeAll(async function () {
      this.timeout(0);

      res = await chai
        .request(server)
        .post("/v1/user/request-stipend")
        .send(incompleteStipendRequestData);
    });
    it("should not be able to send a bad request", async function () {
      expect(res).to.have.status(400);
      expect(res.body.success).to.equal(false);
    });
  });

  describe("Stipend request with wrong data types should fail", function () {
    this.beforeAll(async function () {
      this.timeout(0);

      res = await chai
        .request(server)
        .post("/v1/user/request-stipend")
        .send(badStipendRequestDataType);
    });
    it("should not be able to send a bad request", async function () {
      expect(res).to.have.status(400);
      expect(res.body.success).to.equal(false);
    });
  });

  describe("Successful stipend request will show in the database", function () {
    this.beforeAll(async function () {
      this.timeout(0);

      res = await chai
        .request(server)
        .post("/v1/user/request-stipend")
        .send(completeStipendRequestData);
    });
    it("should be able to check that sent requests reflect in the database", async function () {
      let newRequest = await models.stipendRequest.findOne({
        where: { reasonForRequest: completeStipendRequestData.reasonForRequest }
      });
      // get the request id of this request and save for future tests
      firstRequestId = newRequest.id;
      expect(newRequest).to.include({ ...completeStipendRequestData });
    });
  });

  describe("Admin approving multiple stipend requests should work", function () {
    this.beforeAll(async function () {
      this.timeout(0);

      // I will be sending a second request, and putting the ID to be trackable from the first req
      await chai
        .request(server)
        .post("/v1/user/request-stipend")
        .send({ ...anotherCompleteStipendRequestData, id: firstRequestId + 1 });

      res = await chai
        .request(server)
        .put("/v1/admin/approve-stipend")
        .send({
          stipendRequestIds: [firstRequestId, firstRequestId + 1]
        });
    });
    it("should reflect in the database", async function () {
      expect(res).to.have.status(200);
      // check that it reflects in database
      let newRequest = await models.stipendRequest.findOne({
        where: {
          reasonForRequest: anotherCompleteStipendRequestData.reasonForRequest
        }
      });
      expect(newRequest.isApproved).to.equal(true);
    });
  });

  describe("Admin rejecting multiple stipend requests should work", function () {
    this.beforeAll(async function () {
      this.timeout(0);

      res = await chai
        .request(server)
        .put("/v1/admin/reject-stipend")
        .send({
          stipendRequestIds: [firstRequestId, firstRequestId + 1]
        });
    });
    it("should reflect in the database", async function () {
      expect(res).to.have.status(200);
      // check that it reflects in database
      let newRequest = await models.stipendRequest.findOne({
        where: {
          reasonForRequest: anotherCompleteStipendRequestData.reasonForRequest
        }
      });
      expect(newRequest.isApproved).to.equal(false);
    });
  });

  /**
   * @todo a test to make sure only admins can access route for approval/rejection
   */
  
});
//
describe("Another Test for sending stipend request", function () {
  this.beforeAll(async function () {
    this.timeout(0);

    res = await chai
      .request(server)
      .post("/v1/user/request-stipend")
      .send(approvedUser);
  });
  it("should be able to successfully send a good request", async function () {
    expect(res).to.have.status(201);
    expect(res.body.success).to.equal(true);
    expect(res.body.message).to.equal("Request successfully created");
  });
});
let res

describe('Application Status for denied', function () {
  this.beforeAll(async function(){
    this.timeout(0)
    // const user = 77
    const userId = await models.stipendRequest.findOne({where: {email: anotherCompleteStipendRequestData.email}});
    const user = userId.id
   res = await chai.request(server).get(`/v1/user/application-status/${user}`).send({id: user})
  })

  it('should return "rejected" for a user with a denied application', async() => {
    expect(res).to.have.status(200)
    expect(res.body.message).to.equal('Rejected')
    expect(res.body.success).to.equal(true)
  });
});

describe('Application Status for approved', function () {
  this.beforeAll(async function(){
    this.timeout(0)
    const userId = await models.stipendRequest.findOne({where: {email: approvedUser.email}});
    const user = userId.id
   res = await chai.request(server).get(`/v1/user/application-status/${user}`).send({id: user})
  })

  it('should return "Approved" for a user with an approved application', async() => {
    expect(res).to.have.status(200)
    expect(res.body.message).to.equal('Approved')
    expect(res.body.success).to.equal(true)
  });
});


