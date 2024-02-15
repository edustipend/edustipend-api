const router = require('express').Router()

const {
  getSupportTicket,
  createSupportTicket,
  updateSupportTicket,
  closeSupportTicket,
  reopenSupportTicket,
  getOpenSupportTickets,
} = require("../controller/SupportTicketController")

router.get('/ticket/:ticketId', getSupportTicket)
router.get('/tickets', getOpenSupportTickets)
router.post('/ticket', createSupportTicket)
router.patch('/ticket', updateSupportTicket)

// to be used exclusively by admins
router.patch('/ticket/close', closeSupportTicket)
router.patch('/ticket/reopen', reopenSupportTicket)

module.exports = router