const models = require("../models");
const ErrorHandler = require("../utils/ErrorHandler");

class SupportTicket {
  /**
   * @description Gets a support ticket
   * @param {object} ticketId
   */
  static async getSupportTicket(ticketId) {
    return await models.SupportTicket.findOne({ _id: ticketId})
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
      { status: 'Closed' },
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
      { status: 'Open' },
      { new: true },
    )
  }

  /**
   * @description Gets all open support tickets
   */
  static async getOpenSupportTickets() {
    return await models.SupportTicket.find({
      status: 'Open'
    })
  }
}

module.exports = SupportTicket