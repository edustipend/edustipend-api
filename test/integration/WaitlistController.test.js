const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;
const server = require("../../server");
const models = require("../../models");

const { registerUser } = require("../dummyData");
const { declutter } = require("../../database/migration/test");

let res;

describe("Tests for waitlist", function () {
  this.beforeAll(async function () {
    this.timeout(0);
    await declutter();
  });

  describe("Tests for joining waitlist", function () {
    this.beforeAll(async function () {
      this.timeout(0);

      res = await chai.request(server).post("/v1/waitlist/join-waitlist").send({
        email: registerUser.email,
        name: registerUser.name,
        howDidYouHearAboutUs: registerUser.howDidYouHearAboutUs
      });
    });

    it("should check that a success status code is returned when a user adds their email to waitlist", async function () {
      expect(res).to.have.status(201);
    });
    it("should check that the email reflects in the database", async function () {
      let userInDb = await models.waitlist.findOne({
        where: {
          email: registerUser.email
        }
      });
      expect(userInDb.email).to.equal(registerUser.email);
    });
  });

  describe("Incomplete waitlist data should not go through", function () {
    this.beforeAll(async function () {
      this.timeout(0);

      res = await chai.request(server).post("/v1/waitlist/join-waitlist").send({
        name: registerUser.name,
        howDidYouHearAboutUs: registerUser.howDidYouHearAboutUs
      });
    });

    it("should fail when data is incomplete", async function () {
      expect(res).to.have.status(400);
    });
  });

  describe("Tests for notifying waitlist", function () {
    this.beforeAll(async function () {
      this.timeout(0);

      res = await chai.request(server).post("/v1/admin/notify-waitlist");
    });

    it("should check that a success status code is returned when admin notifies waitlist", async function () {
      expect(res).to.have.status(201);
    });
    it("should check that when the waitlist is notified, the hasBeenNotified field becomes true", async function () {
      let userInDb = await models.waitlist.findOne({
        where: {
          email: registerUser.email
        }
      });
      expect(userInDb.hasBeenNotified).to.equal(true);
    });
    it.skip("should check that only an admin can notify the waitlist", async function () {});
  });
});
