const catchAsyncError = require("../middleware/catchAsyncError");
const SupportTicket = require("../services/SupportTicket")

/**
 * @todo Validation for every function's payload
 */




/**
 * @route GET /v1/support/
 * @description Gets an existing support ticket
 * @access Public
 */
exports.getSupportTicket = catchAsyncError(async (req, res) => {
  const { ticketId } = req.body
  const ticket = await SupportTicket.getSupportTicket(ticketId)

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found'
    })
  }

  return res.status(200).json({
    success: true,
    message: 'Ticket was found',
    body: ticket
  })
})

/**
 * @route POST /v1/support/
 * @description Create a new support ticket
 * @access Public
 */
exports.createSupportTicket = catchAsyncError(async(req, res) => {
  const ticketPayload = req.body
  const newTicket = await SupportTicket.createSupportTicket(ticketPayload)

  if (!newTicket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not created'
    })
  }

  return res.status(201).json({
    success: true,
    message: 'New ticket was created',
    body: newTicket
  })
})

/**
 * @route PATCH /v1/support/
 * @description Modifies an existing support ticket
 */
exports.updateSupportTicket = catchAsyncError(async(req, res) => {
  const updatedTicketData = req.body
  const updatedTicket = await SupportTicket.updateSupportTicket(updatedTicketData)

  if (!updatedTicket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not updated'
    })
  }

  return res.status(201).json({
    success: true,
    message: 'Support ticket has been updated',
    body: updatedTicket
  })
})

/**
 * @route PATCH /v1/support/close
 * @description closes an existing support ticket
 */
exports.closeSupportTicket = catchAsyncError(async(req, res) => {
  const { ticketId } = req.body
  const closedTicket = await SupportTicket.closeSupportTicket(ticketId)

  if (!closedTicket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not closed'
    })
  }

  return res.status(201).json({
    success: true,
    message: 'Support ticket has been closed',
    body: closedTicket
  })
})

/**
 * @route PATCH /v1/support/reopen
 * @description Reopens an existing support ticket
 */
exports.reopenSupportTicket = catchAsyncError(async(req, res) => {
  const { ticketId } = req.body
  const reopenedTicket = await SupportTicket.reopenSupportTicket(ticketId)

  if (!reopenedTicket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not reopened'
    })
  }

  return res.status(201).json({
    success: true,
    message: 'Support ticket has been reopened',
    body: reopenedTicket
  })
})

/**
 * @route GET /v1/support/tickets
 * @description Returns all open support tickets
 */
exports.getOpenSupportTickets = catchAsyncError(async(_, res) => {
  const returnedTickets = await SupportTicket.getOpenSupportTickets()

  if (!returnedTickets) {
    return res.status(404).json({
      success: false,
      message: 'No open support tickets found'
    })
  }

  return res.status(200).json({
    success: true,
    message: 'Open support tickets found',
    tickets: returnedTickets
  })
})