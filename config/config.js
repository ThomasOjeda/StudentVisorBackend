const MONGO_IP = process.env.MONGO_IP || "mongo";
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_URI =
  process.env.MONGO_URI ||
  `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/studentvisordb?retryWrites=true&w=majority&authSource=admin`;

const PORT = process.env.PORT || 5000;

const JWT_SECRET = process.env.JWT_SECRET || "B&E)H@McQfTjWnZr4u7x!A%C*F-JaNd";
const MASTER_SECRET =
  process.env.MASTER_SECRET || "MASTER_SECRET9yB?E(H+MbQeThWmZq4t7w!z%C*F)J@";

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
