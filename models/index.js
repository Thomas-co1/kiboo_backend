const sequelize = require('../core/orm.js');
const User = require('./user.js');
const Role = require('./role.js');
const Image = require('./images.js');
const Animal = require('./animal.js');
const Like = require('./like.js');
const Demande = require('./demande_adoption.js');
const Message = require('./message.js');
const Partenaire = require('./partenaire.js');
const Astuce = require('./astuce.js');
const Tag = require('./tag.js');

//Relations
User.belongsTo(Role, { foreignKey: 'role' });
Role.hasMany(User, { foreignKey: 'role' });
User.hasMany(Animal, { foreignKey: 'user_id' });
Animal.belongsTo(User, { foreignKey: 'user_id' });
Animal.hasMany(Image, { foreignKey: 'animal_id' });
Image.belongsTo(Animal, { foreignKey: 'animal_id' });
Animal.hasMany(Like, { foreignKey: 'animal_id' });
Like.belongsTo(Animal, { foreignKey: 'animal_id' });
User.hasMany(Like, { foreignKey: 'user_id' });
Like.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Demande, { foreignKey: 'user_id' });
Demande.belongsTo(User, { foreignKey: 'user_id' });
Animal.hasMany(Demande, { foreignKey: 'animal_id' });
Demande.belongsTo(Animal, { foreignKey: 'animal_id' });
// Messages - Two relations with User (sender and receiver)
User.hasMany(Message, { foreignKey: 'sender_id', as: 'SentMessages' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'Sender' });
User.hasMany(Message, { foreignKey: 'receiver_id', as: 'ReceivedMessages' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'Receiver' });
// Tags
User.hasMany(Tag, { foreignKey: 'user_id' });
Tag.belongsTo(User, { foreignKey: 'user_id' });

//sequelize.sync{{alter:true}}

module.exports = {
    "User": User,
    "Role": Role,
    "Image": Image,
    "Animal": Animal,
    "Like": Like,
    "Demande": Demande,
    "Message": Message,
    "Partenaire": Partenaire,
    "Astuce": Astuce,
    "Tag": Tag,
    sequelize:sequelize
};


