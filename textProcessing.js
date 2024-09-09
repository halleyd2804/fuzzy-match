const natural = require('natural');
const stopwords = natural.stopwords;
const { MongoClient } = require('mongodb');

const tokenizer = new natural.WordTokenizer();

function preprocessText(text) {
  let lowerCaseText = text.toLowerCase();
  let tokens = tokenizer.tokenize(lowerCaseText);
  const filteredTokens = tokens.filter(token => !stopwords.includes(token));
  return filteredTokens.join(' ');
}

function concatItemDetails(item) {
  if (!item || typeof item !== 'object') {
    throw new Error('Invalid item object');
  }
  const text = Object.values(item);
  const concatText = text.map(value => {
    return String(value); 
  }).join(' ');
  return preprocessText(concatText);
}
/* Testing function */
function test_preprocessText(text){
    console.log('Original Text:', text);
    console.log('Processed Text:', preprocessText(text));
}

// test_preprocessText("The best N95 Medical masks for surgical doctor")
// test_preprocessText("A Latex glove for surgeons who do surgery")

// function test_concatItemDetails(){
//     const exampleItem = {
//         item: 'Infrared Forehead Thermometers',
//         quantity: 120,
//         description: 'Non-contact infrared forehead thermometers providing quick and accurate temperature readings. Ideal for reducing the risk of cross-contamination.',
//         expiry_date: '2025-04-04',
//         manufacture_date: '2024-04-04',
//         barcode: '1234567890130'
//       };
//     console.log(concatItemDetails(exampleItem));
// }

//test_concatItemDetails();
module.exports = { concatItemDetails, preprocessText };

