const ObjectId = require("mongoose").Types.ObjectId;
const ApplicationStatus = require("../constants/applicationStatus");
const models = require("../models");
const ErrorHandler = require("../utils/ErrorHandler");
const Mail = require("./Mail");
const Logger = require("../config/logger");

class StipendApplication {
  /**
   * @description Create a new stipend application
   * @param {object} data
   */
  static async create(stipendApplication, user) {
    return await models.StipendApplication.create({
      ...stipendApplication,
      user
    });
  }

  /**
   * @description Find a single stipend application by id
   * @param {string} id
   */
  static async findById(id) {
    const stipendApplication = await models.StipendApplication.findOne({
      _id: id
    });
    return stipendApplication;
  }

  /**
   * @description Edit an existing stipend application
   * @param {object} data
   */
  static async update(stipendApplication) {
    const id = stipendApplication.applicationId;
    delete stipendApplication.applicationId;

    return await models.StipendApplication.findOneAndUpdate(
      { _id: id },
      stipendApplication,
      { new: true }
    );
  }

  /**
   * @description Batch update stipend applications
   * @param {object} data
   */
  static async batchUpdate(updateOptions, startDate, endDate) {
    let verifiedApplicationIds = [];
    let stipendApplications = [];
    let verifiedStipendApplications = [];

    try {
      stipendApplications = await models.StipendApplication.find({
        createdAt: {
          $lte: new Date(endDate), //TODO: Update this to read from req body
          $gte: new Date(startDate)
        }
      })
        .populate("user")
        .exec();
    } catch (error) {
      throw error;
    }

    try {
      verifiedStipendApplications = stipendApplications
        .filter((stipendApplication) => stipendApplication?.user.isVerified)
        .map((stipendApplication) => ({
          id: stipendApplication._id,
          name: stipendApplication.user.name.trim(),
          stipendCategory: stipendApplication.stipendCategory,
          email: stipendApplication.user.email,
          isVerified: stipendApplication.user.isVerified
        }));
      verifiedApplicationIds = verifiedStipendApplications.map(
        (stipendApplication) => new ObjectId(stipendApplication.id)
      );

      Logger.info(
        `Query start date: ${startDate},
        Query end date: ${endDate},
        Total stipend applications for the month: ${stipendApplications.length},
        Verified stipend applications for the month: ${verifiedApplicationIds.length}
      `
      );

      const res = await models.StipendApplication.updateMany(
        { _id: { $in: verifiedApplicationIds } },
        updateOptions,
        { multi: true }
      );

      try {
        Mail.batchSendApplicationStipendStatusEmails(
          verifiedStipendApplications
        );
      } catch (error) {
        // Fail silently
        Logger.error(error);
      }

      return res;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description Batch approve / reject stipend applications
   * @param {object} data
   */
  static async batchApprove(approvedIds, startDate, endDate) {
    const mongooseApprovedIds = approvedIds.map(
      (approvedId) => new ObjectId(approvedId)
    );
    let approvedStipendApplications = [];
    let approvedStipendApplicationUserIds = [];

    try {
      approvedStipendApplications = await models.StipendApplication.find({
        _id: { $in: mongooseApprovedIds },
        createdAt: {
          $lte: new Date(endDate), //TODO: Update this to read from req body
          $gt: new Date(startDate)
        }
      })
        .populate("user")
        .exec();
    } catch (error) {
      Logger.error(error);
      throw error;
    }

    Logger.info(
      `Setting application status to ${ApplicationStatus.APPROVED} for ${approvedStipendApplications.length}`
    );

    let userApplicationMapping = {};
    let approvedUpdateRes;
    let unapprovedUpdateRes;

    try {
      //update the status and set it to approved
      approvedUpdateRes = await models.StipendApplication.updateMany(
        { _id: { $in: mongooseApprovedIds } },
        { status: ApplicationStatus.APPROVED },
        { multi: true }
      );
      console.log(approvedUpdateRes);
    } catch (err) {
      console.log("Error updating status for approved applications");
      Logger.error(err);
    }

    try {
      //update the status and set it to UNAPPROVED
      unapprovedUpdateRes = await models.StipendApplication.updateMany(
        {
          _id: { $nin: mongooseApprovedIds },
          createdAt: {
            $lt: new Date("2024-01-31T00:00:00Z"),
            $gte: new Date("2023-12-31T00:00:00Z")
          }
        },
        { status: ApplicationStatus.UNAPPROVED },
        { multi: true }
      );
    } catch (err) {
      console.log("Error updating status for unapproved applications");
      Logger.error(err);
    }

    try {
      approvedStipendApplicationUserIds = approvedStipendApplications.map(
        (stipendApplication) => {
          userApplicationMapping[stipendApplication.user._id] = {
            email: stipendApplication.user.username,
            id: stipendApplication._id
          };
          return stipendApplication.user._id;
        }
      );

      approvedStipendApplicationUserIds.forEach(async (userId) => {
        try {
          await models.User.findOneAndUpdate(
            { _id: userId },
            {
              $addToSet: {
                approvedApplications: userApplicationMapping[userId].id
              }
            }
          );
        } catch (error) {
          Logger.error(error);
          console.log(
            `Error updating list of approved application for user - ${userApplicationMapping[userId].email} with application id - ${userApplicationMapping[userId].id}`
          );
        }
      });
    } catch (error) {
      throw error;
    }

    return {
      approved: approvedUpdateRes,
      unapproved: unapprovedUpdateRes
    };
  }

  /**
   * @description Get user's sorted stipend application history
   * @param {string} email
   */
  //TODO: Paginate this endpoint
  static async getHistory(userId) {
    const stipendApplicationHistory = await models.StipendApplication.find({
      user: new ObjectId(userId)
    });

    return stipendApplicationHistory;
  }

  /**
   * @description approve a stipend request
   * @param {string} stipendRequestId
   */

  static async approve({ stipendRequestIds }) {
    const stipend = await models.stipendRequest.update(
      { isApproved: true, isDenied: false },
      {
        where: { id: stipendRequestIds, isReceived: true }
      }
    );

    if (stipend[0] === 0) {
      throw new ErrorHandler("Application not found", 404);
    }
  }

  /**
   * @description Deny a stipend request
   * @param {string} stipendRequestId
   */

  static async deny({ stipendRequestIds }) {
    const stipend = await models.stipendRequest.update(
      { isApproved: false, isDenied: true },
      {
        where: { id: stipendRequestIds, isReceived: true }
      }
    );

    if (!stipend) {
      throw new ErrorHandler("Application not found", 404);
    }
  }
}

module.exports = StipendApplication;
