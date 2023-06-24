const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.get('/news', async (req, res) => {
  try {
    const apiUrl = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=9R07HDWXSPTYIOF6`;

    const response = await axios.get(apiUrl);
    const feed = response.data.feed;
    res.status(200).send(feed);
    
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).send('Error occurred');
  }
});

async function updateNews() {
    try {
      const apiUrl = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=9R07HDWXSPTYIOF6`;
  
      const response = await axios.get(apiUrl);
      const feed = response.data.feed;
  
      // Update the news data in your database or cache
      // ...
  
      console.log('News updated successfully.');
    } catch (error) {
      console.error('Error occurred:', error.message);
    }
}
  
// Schedule the updateNews function to run daily at 12:00 AM
cron.schedule('0 3 * * *', updateNews);








const port = 5001;

app.use(express.static('public'));

app.listen(port,()=>{
    console.log(`Server is listening on port ${port}....`)
})
