const mongoose = require('mongoose');
const fs = require('fs');

const uri = 'mongodb+srv://stampello:STMPDBlog2025@cluster0.bx9fhwy.mongodb.net/stampello?retryWrites=true&w=majority&appName=Cluster0';
const Stamp = mongoose.model('Stamp', new mongoose.Schema({
  title: String,
  image: String,
  year: String,
  description: String,
  country: String,
  value: String,
  category: String
}));

mongoose.connect(uri).then(async () => {
  const stamps = JSON.parse(fs.readFileSync('stamps.json'));
  await Stamp.insertMany(stamps);
  console.log('Stamps imported!');
  mongoose.disconnect();
}).catch(err => console.error(err));
