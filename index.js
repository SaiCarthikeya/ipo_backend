import express from 'express';
import cors from 'cors';
import axios from 'axios';
import firebase from './firebase.js'
import {getDocs, addDoc, collection, getFirestore} from 'firebase/firestore'
import dotenv from 'dotenv'

dotenv.config();
const app = express()
app.use(cors());

const db = getFirestore(firebase);
const port = process.env.PORT || 3000;

const getFireStoreIpos = async (status) => {
  try {
    const firestoreIPOS = await getDocs(collection(db, `ipo${status}`))
    if (firestoreIPOS.empty) {
      return "";
    }
    console.log(firestoreIPOS);
    return firestoreIPOS;
  } catch (error) {
    console.log(error);
    return error;
  }
}

app.get('/ipos', async (req, res) => {
    let status = req.query.status
    status = (status === null || status === undefined) ? "open" : status;

    const currentDateTime = new Date();
    console.log(currentDateTime);
    const firestoreIPO = await getFireStoreIpos(status);
    console.log(firestoreIPO)
    console.log(status)
    const fetchFromApi = async () => {
      const config = {
          method: 'get',
          url: `https://api.ipoalerts.in/ipos?status=${status}`,
          headers: { 
            'x-api-key': process.env.API_KEY
          }
        };
        try {
  
          const response = await axios.request(config);
          const result = await response.data;
          console.log(result)
          await addDoc(collection(db, `ipo${status}`), {date_time: currentDateTime,ipos: result.ipos})
          res.json({ipos: result.ipos})
        } catch (e){
              console.log(`Something went wrong ${e}`)
              res.status(e.status)
        }

    }
    if (firestoreIPO === "") {
      await fetchFromApi();
  } else {
      const firestoreDateTime = firestoreIPO.date_time;
      const diff = firestoreDateTime - currentDateTime;
      const hourInMS = 3600000;
      if (diff > hourInMS) {
        await fetchFromApi();
      } else {
        res.json(firestoreIPO.ipos)
      }
  }
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})