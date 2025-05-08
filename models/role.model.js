export default (sequelize, Sequelize) => {
    const Role = sequelize.define("Role", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });
  
    return Role;
  };