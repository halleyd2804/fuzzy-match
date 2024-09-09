const { MongoClient, ServerApiVersion } = require('mongodb');
const { concatItemDetails } = require('./textProcessing');
// MongoDB connection URI
const uri = "mongodb+srv://halleydao2004:iz6K9o4t5gbhASlt@clustertest.k5h3s.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTest";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const items = [
      {
        item: 'Disposable Surgical Masks',
        quantity: 500,
        description: 'High-quality disposable masks designed for surgical use, providing excellent protection against airborne particles and contaminants. Ideal for healthcare professionals and patients.',
        expiry_date: '2025-03-01',
        manufacture_date: '2024-03-01',
        barcode: '1234567890123'
      },
      {
        item: 'N95 Respirator Masks',
        quantity: 300,
        description: 'Advanced N95 respirator masks offering superior filtration efficiency, protecting against harmful airborne particles. Essential for high-risk environments and medical settings.',
        expiry_date: '2025-03-01',
        manufacture_date: '2024-03-01',
        barcode: '1234567890124'
      },
      {
        item: 'Nitrile Examination Gloves',
        quantity: 1000,
        description: 'Durable nitrile gloves for examination purposes, ensuring safety and hygiene. These gloves are latex-free, making them suitable for individuals with latex allergies.',
        expiry_date: '2025-03-01',
        manufacture_date: '2024-03-01',
        barcode: '1234567890125'
      },
      {
        item: 'Latex Surgical Gloves',
        quantity: 800,
        description: 'High-quality latex surgical gloves providing excellent tactile sensitivity and protection. Ideal for surgical procedures and medical examinations.',
        expiry_date: '2025-03-15',
        manufacture_date: '2024-03-15',
        barcode: '1234567890126'
      },
      {
        item: 'Sterile Gauze Pads',
        quantity: 300,
        description: 'Sterile gauze pads for wound care, highly absorbent and safe for medical use. Perfect for dressing wounds, absorbing exudate, and protecting against infection.',
        expiry_date: '2025-03-15',
        manufacture_date: '2024-03-15',
        barcode: '1234567890127'
      },
      {
        item: 'Sterile Cotton Balls',
        quantity: 600,
        description: 'Soft and sterile cotton balls ideal for cleaning wounds, applying antiseptics, and general medical use. Highly absorbent and gentle on the skin.',
        expiry_date: '2025-04-04',
        manufacture_date: '2024-04-04',
        barcode: '1234567890128'
      },
      {
        item: 'Digital Thermometers',
        quantity: 150,
        description: 'Accurate digital thermometers for measuring body temperature, easy to use with quick readings. Essential for monitoring patient health and detecting fever.',
        expiry_date: '2025-04-04',
        manufacture_date: '2024-04-04',
        barcode: '1234567890129'
      },
      {
        item: 'Infrared Forehead Thermometers',
        quantity: 120,
        description: 'Non-contact infrared forehead thermometers providing quick and accurate temperature readings. Ideal for reducing the risk of cross-contamination.',
        expiry_date: '2025-04-04',
        manufacture_date: '2024-04-04',
        barcode: '1234567890130'
      }
    ];
    const processedItems = items.map(item => ({
        ...item,
        searchText: concatItemDetails(item)
      }));

    // Access database and collection
    const db = client.db("Test");  
    const collection = db.collection("MedicalItems");  

    // Insert data into the collection
    const result = await collection.insertMany(processedItems);
    console.log(`${result.insertedCount} documents were inserted`);

  } finally {
    await client.close();
  }
}
run().catch(console.dir);
