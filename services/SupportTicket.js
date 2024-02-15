const models = require("../models");
const ErrorHandler = require("../utils/ErrorHandler");

class SupportTicket {
  /**
   * @description Gets a support ticket
   * @param {object} ticketId
   */
  static async getSupportTicket(ticketId) {
    try {
      return await models.SupportTicket.findOne({ _id: ticketId})
    } catch(e) {
      throw new ErrorHandler(e, 400)
    }
  }

  /**
   * @description Creates a support ticket
   * @param {object} data
   */
  static async createSupportTicket(data) {
    return await models.SupportTicket.create(data)
  }

  /**
   * @description Updates a support ticket
   * @param {object} data
   */
  static async updateSupportTicket(data) {
    const id = data.ticketId
    delete data.ticketId

    return await models.SupportTicket.findOneAndUpdate(
      { _id: id },
      data,
      { new: true }  
    )
  }

  /**
   * @description Closes a support ticket
   * @param {object} ticketId
   */
  static async closeSupportTicket(ticketId) {
    return await models.SupportTicket.findByIdAndUpdate(
      ticketId,
      { status: 'closed' },
      { new: true },
    )
  }

  /**
   * @description Reopens a support ticket
   * @param {object} ticketId
   */
  static async reopenSupportTicket(ticketId) {
    return await models.SupportTicket.findByIdAndUpdate(
      ticketId,
      { status: 'open' },
      { new: true },
    )
  }

  /**
   * @description Gets all open support tickets
   */
  static async getOpenSupportTickets() {
    return await models.SupportTicket.find({
      status: 'open'
    })
  }
}

module.exports = SupportTicket