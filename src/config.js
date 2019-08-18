const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || '10E57825F89949BD99BF7714C02064C8431A28E322A17CC15E3B07C791AFFE78', // taken from https://www.grc.com/passwords.htm
  mongouri: process.env.MONGO_URI || 'mongodb://localhost:27017/video-rental',
}

module.exports = config;
