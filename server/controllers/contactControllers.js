const { where } = require("sequelize");
const { contacts } = require("../models");

class contactControllers {
  static getContact(req, res) {
    contacts
      .findAll({
        where: {
          userId: req.userId
        }
      })
      .then((contact) => {
        res.json(contact);
      })
      .catch((err) => {
        res.json(err);
      });
  }
  static add(req, res) {
    const { username, email, phone_number } = req.body;

    contacts
      .create({
        username: username,
        email: email,
        phone_number: phone_number,
        userId: req.userId
      })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.json(err);
      });
  }
  static update(req, res) {
    const id = +req.params.id;
    const { username, email, phone_number } = req.body;

    contacts
      .update(
        {
          username,
          email,
          phone_number,
        },
        {
          where: {
            id: id,
            userId: req.userId
          },
        }
      )
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.json(err);
      });
  }
  static delete(req, res) {
    const id = +req.params.id; 
    contacts
      .destroy({
        where: {
          id: id,
          userId: req.userId
        },
      })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.json(err);
      });
  }
}

module.exports = contactControllers;
