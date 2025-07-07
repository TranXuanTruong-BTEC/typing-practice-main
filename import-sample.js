const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = 'mongodb+srv://tranmin1120:0394164857@cluster0.dgjcslo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dataPath = path.join(__dirname, 'src', 'data', 'typing-texts.json');

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  await db.collection('typingTexts').deleteMany({});
  await db.collection('typingTexts').insertMany(data);
  console.log('Import thành công!');
  await client.close();
}

run().catch(err => {
  console.error('Import thất bại:', err);
  process.exit(1);
}); 