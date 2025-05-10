export default {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGO_URI || 'your_mongo_uri',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  };
  