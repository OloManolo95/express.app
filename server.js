const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const multer = require('multer');

const app = express();
app.engine('hbs', hbs({ extname: 'hbs', layoutsDir: './views/layouts', defaultLayout: 'main' }));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads'); // Change this to the appropriate directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/hello/:name', (req, res) => {
  res.render('hello', { name: req.params.name });
});

app.get('/about', (req, res) => {
  res.render('about', { layout: 'dark' });
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/info', (req, res) => {
  res.render('info');
});

app.get('/history', (req, res) => {
  res.render('history');
});

// Update the POST route to handle file upload
app.post('/contact/send-message', upload.single('image'), (req, res) => {
  const { author, sender, title, message } = req.body;
  const uploadedImage = req.file;

  if (author && sender && title && message && uploadedImage) {
    res.render('contact', { isSent: true, uploadedImage: uploadedImage.filename });
  } else {
    res.render('contact', { isError: true });
  }
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
})

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});