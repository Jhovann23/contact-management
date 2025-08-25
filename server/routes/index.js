const routes = require('express').Router()
const contactsRoutes = require('./contacts.js')
const userControllers = require('../controllers/userControllers.js')
const refreshToken = require('../controllers/refreshToken.js')
const verifyToken = require('../middleware/verifyToken.js')

routes.get('/', (req, res) => {
    res.json({
        massage: 'ini home'
    })
})

//refresh token
routes.get('/token', refreshToken)

//user
routes.post('/login', userControllers.login )
routes.post('/register', userControllers.register)
routes.delete('/logout', userControllers.logout)
routes.put('/update',verifyToken,userControllers.updateUsername)
routes.put('/update-password', verifyToken, userControllers.changePassword)

//contact 
routes.use('/contacts', contactsRoutes)

module.exports = routes