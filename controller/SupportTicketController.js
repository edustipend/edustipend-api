const catchAsyncError = require("../middleware/catchAsyncError");
const SupportTicket = require("../services/SupportTicket");
const ErrorHandler = require("../utils/ErrorHandler");
const { 
  validateTicketId,
  validateCreateSupportTicket,
  validateUpdateSupportTicket,
} = require("../validation/SupportTicketValidation");

/**
 * @todo create function for adding new comments
 */




/**
 * @route GET /v1/support/
 * @description Gets an existing support ticket
 * @access Public
 */
exports.getSupportTicket = catchAsyncError(async (req, res) => {
  const validatedTicketId = validateTicketId(req.body)

  if (validatedTicketId.error) {
    throw new ErrorHandler(validatedTicketId.error, 400)
  }

  const { ticketId } = validatedTicketId.value
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
  const validatedPayload = validateCreateSupportTicket(req.body)
  
  if (validatedPayload.error) {
    throw new ErrorHandler(validatedPayload.error, 400)
  }

  const ticketPayload = validatedPayload.value
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
  const validatedPayload = validateUpdateSupportTicket(req.body)

  if (validatedPayload.error) {
    throw new ErrorHandler(validatedPayload.error, 400)
  }

  const updatedTicketData = validatedPayload.value
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
  const validatedTicketId = validateTicketId(req.body)

  if (validatedTicketId.error) {
    throw new ErrorHandler(validatedTicketId.error, 400)
  }

  const { ticketId } = validatedTicketId.value
  const closedTicket = await SupportTicket.closeSupportTicket(ticketId)

  if (!closedTicket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found'
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
  const validatedTicketId = validateTicketId(req.body)

  if (validatedTicketId.error) {
    throw new ErrorHandler(validatedTicketId.error, 400)
  }

  const { ticketId } = validatedTicketId.value
  const reopenedTicket = await SupportTicket.reopenSupportTicket(ticketId)

  if (!reopenedTicket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found'
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