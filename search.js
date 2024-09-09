const { MongoClient } = require('mongodb');
const { preprocessText, concatItemDetails } = require('./textProcessing');
const uri = "mongodb+srv://halleydao2004:iz6K9o4t5gbhASlt@clustertest.k5h3s.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTest";
const client = new MongoClient(uri);

let db, collection;

async function connectToDatabase() {
  if (!db || !collection) {
    await client.connect();
    db = client.db('Test');
    collection = db.collection('MedicalItems');
  }
}

function textToVector(text, allTerms) {
  const tokens = text.split(' ');
  const termMap = new Map(allTerms.map((term, index) => [term, index]));
  const vector = new Array(allTerms.length).fill(0);

  tokens.forEach(token => {
    if (termMap.has(token)) {
      vector[termMap.get(token)] = 1;
    }
  });

  return vector;
}

function calculateCosineSimilarity(vector1, vector2) {
  const dotProduct = vector1.reduce((sum, val, index) => sum + (val * vector2[index]), 0);
  const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + (val * val), 0));
  const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + (val * val), 0));

  return (magnitude1 && magnitude2) ? dotProduct / (magnitude1 * magnitude2) : 0;
}

async function searchSimilarItems(inputText) {
  try {
    await connectToDatabase();
    const processedInput = preprocessText(inputText);
    const items = await collection.find({}).toArray();

    const allTermsSet = new Set();
    items.forEach(item => {
      if (item.searchText) {
        item.searchText.split(' ').forEach(term => allTermsSet.add(term));
      }
    });

    const allTerms = Array.from(allTermsSet);
    const inputVector = textToVector(processedInput, allTerms);

    const itemsWithSimilarity = items.map(item => {
      const itemVector = textToVector(item.searchText, allTerms);
      const similarity = calculateCosineSimilarity(inputVector, itemVector);
      return { ...item, similarity };
    });

    return itemsWithSimilarity.sort((a, b) => b.similarity - a.similarity).slice(0, 3);
  } finally {
    await client.close();
  }
}

// Test
const test = "Manufactured on: 2024-01-10. The product is a high-quality face mask designed for protection. Expiry date is 2026-01-10. The item is a 'Medical Face Mask' with a quantity of 5000 units. Each mask is made from multiple layers of non-woven fabric, ensuring safety and comfort. Barcode number: 9876543210987. This product is essential for preventing the spread of respiratory infections and ensuring hygiene during medical procedures"
searchSimilarItems(test)
  .then(topItems => {
    console.log('Top 3 most similar items:', topItems);
  })
  .catch(console.error);
