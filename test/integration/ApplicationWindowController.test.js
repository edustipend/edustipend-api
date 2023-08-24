const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;
const server = require("../../server");
const models = require("../../models");
const {
  validUpcomingApplicationWindow,
  validActiveApplicationWindow,
  invalidApplicationWindowFormat
} = require("../dummyData");
const { declutter } = require("../../database/migration/test");
const { Op } = require("sequelize");

describe("Tests for application window", function () {
  this.beforeAll(async function () {
    this.timeout(0);
    await declutter();
  });

  let res;

  describe("Tests for successfully setting up application window", function () {
    this.beforeAll(async function () {
      this.timeout(0);

      res = await chai
        .request(server)
        .post("/v1/admin/application-window")
        .send(validUpcomingApplicationWindow);
    });

    it("should return status code of 201 when a window is successfully set", async function () {
      expect(res).to.have.status(201);
    });

    it("should test that when start date does not fall on today's date, status should be upcoming", async function () {
      let newWindow = await models.applicationWindow.findOne({
        where: { startDate: validUpcomingApplicationWindow.startDate }
      });
      expect(newWindow.status).to.equal("upcoming");
    });
    // it.skip("should not allow a non-admin user to set a window", async function () { });
  });

  describe("Test for status to be active when window start date is current date", function () {
    this.beforeAll(async function () {
      this.timeout(0);

      res = await chai
        .request(server)
        .post("/v1/admin/application-window")
        .send(validActiveApplicationWindow);
    });

    it("should test that when start date of window falls on today's date, status should be active", async function () {
      let newWindow = await models.applicationWindow.findOne({
        where: { startDate: validActiveApplicationWindow.startDate }
      });
      expect(newWindow.status).to.equal("active");
    });
  });

  describe("Test for when invalid date formats are passed", function () {
    this.beforeAll(async function () {
      this.timeout(0);

      res = await chai
        .request(server)
        .post("/v1/admin/application-window")
        .send(invalidApplicationWindowFormat);
    });

    it("should have status code of 400 when invalid date formats are passed", async function () {
      expect(res).to.have.status(400);
    });
  });

  describe("Tests for manually closing an application window", function () {
    // we will need a variable to store the initial values of status and isClosedByAdmin
    let applicationWindowToBeClosed;

    this.beforeAll(async function () {
      this.timeout(0);

      // first set a valid date and send to db
      await chai
        .request(server)
        .post("/v1/admin/application-window")
        .send(validActiveApplicationWindow);

      applicationWindowToBeClosed = await models.applicationWindow.findOne({
        where: {
          status: {
            [Op.or]: ["active", "upcoming"]
          },
          isClosedByAdmin: false
        }
      });

      res = await chai
        .request(server)
        .put("/v1/admin/close-application-window")
        .send();
    });

    it("should check that the status and isClosedByAdmin fields get updated & 201 is returned", async function () {
      const closedApplicationWindow = await models.applicationWindow.findOne({
        where: {
          startDate: applicationWindowToBeClosed.startDate,
          endDate: applicationWindowToBeClosed.endDate
        }
      });
      expect(res).to.have.status(201);
      expect(closedApplicationWindow.isClosedByAdmin).to.equal(true);
      expect(closedApplicationWindow.status).to.equal("expired");
    });
    // it.skip("should not allow a non-admin user to close a window", async function () { });
  });
});
