const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;
const server = require("../../server");
const models = require("../../models");
const {} = require("../dummyData");
const { declutter } = require("../../database/migration/test");

describe("Tests for application window", function () {
  this.beforeAll(async function () {
    this.timeout(0);
    await declutter();
  });

  describe("Tests for successfully setting up application window", function () {
    /**
     * @todo add beforeAll function
     */

    it.skip("should return status code of 201 when a window is successfully set", async function () {});
    it.skip("should not allow a non-admin user to set a window", async function () {});
    it.skip("should fail when invalid date formats are passed", async function () {});
    it.skip("should not allow endDate to be earlier than startDate", async function () {});
  });

  describe("Tests for manually closing an application window", function () {
    /**
     * @todo add beforeAll function
     */

    it.skip("should return status code of 201 when a window is manually closed", async function () {});
    it.skip("should not allow a non-admin user to close a window", async function () {});
    it.skip("should check that the status and isClosedByAdmin fields get updated", async function () {});
  });
});
