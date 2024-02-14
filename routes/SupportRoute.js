const router = require('express').Router()

const {
  getSupportTicket,
  createSupportTicket,
  updateSupportTicket,
  closeSupportTicket,
  reopenSupportTicket,
} = require("../controller/SupportTicketController")

router.get('/ticket', getSupportTicket)
router.post('/ticket', createSupportTicket)
router.patch('/ticket', updateSupportTicket)

// to be used exclusively by admins
router.patch('/ticket/close', closeSupportTicket)
router.patch('/ticket/reopen', reopenSupportTicket)

module.exports = router