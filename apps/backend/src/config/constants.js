const SERVER_PORT = Number(process.env.PORT) || 8080;
const JWT_SECRET_KEY = process.env.JWT_SECRET || 'dev-fallback-key';

module.exports = {
  SERVER_PORT,
  JWT_SECRET_KEY,
};
