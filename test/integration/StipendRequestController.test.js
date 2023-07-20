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
  badStipendRequestDataType
} = require("../dummyData");
const { declutter } = require("../../database/migration/test");

describe("Test for Stipend Request", function () {
  this.beforeAll(async function () {
    this.timeout(0);
    await declutter();
  });

  let res;

  describe("Test for sending stipend request", function () {
    this.beforeAll(async function () {
      this.timeout(0);

      res = await chai
        .request(server)
        .post("/v1/user/request-stipend")
        .send(completeStipendRequestData);
    });
    it("should be able to successfully send a good request", async function () {
      console.log("The value of the response is", res);
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
      expect(newRequest).to.include({ ...completeStipendRequestData });
    });
  });
});
