const mongoose = require('mongoose');
require('dotenv').config();

// Career DB (default)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to Career MongoDB'))
  .catch((err) => {
    console.error('❌ Failed to connect to Career MongoDB:', err);
    process.exit(1);
  });

// Contact DB
const contactDB = mongoose.createConnection(process.env.MONGODB_CONTACT_URI, {
  dbName: 'contactDB',
  useNewUrlParser: true,
  useUnifiedTopology: true
});

contactDB.on('connected', () => {
  console.log('✅ Connected to Contact MongoDB');
});

contactDB.on('error', (err) => {
  console.error('❌ Contact MongoDB connection error:', err);
});

module.exports = { mongoose, contactDB };
