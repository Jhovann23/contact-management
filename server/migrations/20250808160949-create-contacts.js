'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contacts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
       userId: { // FK ke tabel Users
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', 
          key: 'id'        // kolom yang dirujuk (PK dari Users)
        },
        onUpdate: 'CASCADE', // kalau user diganti, kontaknya ikut diganti
        onDelete: 'CASCADE'  // kalau user dihapus, kontaknya ikut dihapus
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contacts');
  }
};