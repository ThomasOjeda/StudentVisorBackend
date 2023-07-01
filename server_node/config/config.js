const MONGO_IP = process.env.MONGO_IP || "mongo-service";
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/studentvisordb?retryWrites=true&w=majority&authSource=admin`;

const PORT = process.env.PORT || 5000;

const JWT_SECRET = process.env.JWT_SECRET;
const MASTER_SECRET = process.env.MASTER_SECRET;

module.exports = {
  MONGO_IP,
  MONGO_PORT,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_URI,
  PORT,
  JWT_SECRET,
  MASTER_SECRET,
};
