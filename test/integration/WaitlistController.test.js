const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;
const server = require("../../server");
const models = require("../../models");

const {} = require("../dummyData");
const { declutter } = require("../../database/migration/test");

describe("Tests for waitlist", function () {
  this.beforeAll(async function () {
    this.timeout(0);
    await declutter();
  });

  describe("Tests for joining waitlist", function () {
    /**
     * @todo add beforeAll function
     */

    it.skip("should check that a success status code is returned when a user adds their email to waitlist", async function () {});
    it.skip("should check that the email reflects in the database", async function () {});
  });

  describe("Tests for notifying waitlist", function () {
    /**
     * @todo add beforeAll function
     */

    it.skip("should check that a success status code is returned when admin notifies waitlist", async function () {});
    it.skip("should check that only an admin can notify the waitlist", async function () {});
    it.skip("should check that when the waitlist is notified, the hasBeenNotified field becomes true", async function () {});
  });
});
