const contactsRoutes = require('express').Router()
const contactController = require('../controllers/contactControllers')
const verifyToken = require('../middleware/verifyToken')

contactsRoutes.get('/', verifyToken, contactController.getContact)
contactsRoutes.post('/',verifyToken, contactController.add)
contactsRoutes.put('/:id',verifyToken, contactController.update)
contactsRoutes.delete('/:id',verifyToken, contactController.delete)

module.exports = contactsRoutes