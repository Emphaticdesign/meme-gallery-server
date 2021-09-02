const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId =require('mongodb').ObjectId;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b3llw.mongodb.net/memeGallery?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('memes'));
app.use(fileUpload());

const port = 5000

app.get('/', (req, res) => {
  res.send('hello my name is sahjalal hossain')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const memeCollection = client.db("memeGallery").collection("memeIgames");

  app.post('/addMeme', (req, res) => {
    const file = req.files.file;
    const link = req.body.link;
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
    };

    memeCollection.insertOne({ link, image })
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.get('/memes', (req, res) => {
    memeCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  });

  app.delete('/deleteMeme/:id', (req, res) => {
    const id =ObjectId(req.params.id);
    memeCollection.deleteOne({_id: id})
    .then(result =>{
       res.send(result);
      })
});

});

app.listen(process.env.PORT || port)