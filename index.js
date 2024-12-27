require('dotenv').config()

const express = require('express')
const cors = require('cors')
const axios = require('axios');

const app = express()
app.use(cors());

const port = process.env.PORT || 3000;

app.get('/ipos', (req, res) => {
    const config = {
        method: 'get',
        url: 'https://api.ipoalerts.in/?status=open',
        headers: { 
          'x-api-key': process.env.API_KEY
        }
      };
    axios.request(config)
    .then(response => {
        const result = JSON.stringify(response.data)
        console.log(result)
        res.json({ipos: result})
    }).catch(e => {
        console.log(`Something went wrong ${e}`)
        res.status(400)
    })
})

app.get('/ipo/:id', (req, res) => {
    const ipo_id = req.params.id
    const config = {
        method: 'get',
        url: `https://api.ipoalerts.in/ipos/:${ipo_id}`,
        headers: { 
          'x-api-key': process.env.API_KEY
        }
      };
    axios.request(config)
    .then(response => {
        const result = JSON.stringify(response.data)
        console.log(result)
        res.json({ipo: result})
    }).catch(e => {
        console.log(`Something went wrong ${e}`)
        res.status(400)
    })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})