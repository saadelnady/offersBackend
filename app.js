const express = require('express');
const dotenv = require('dotenv');
const { connection } = require('./src/config/database.js');
const ErrorAPI = require('./src/utils/errorAPI.js');
const globalError = require('./src/middlewares/error.js');
const orderRouter = require('./src/routes/order.js');
const userRouter = require('./src/routes/user.js');
const companyRouter = require('./src/routes/company.js');
const authRouter = require('./src/routes/auth.js');
const servicesRouter = require('./src/routes/services.js');
const categoryRouter = require('./src/routes/category.js');
const extraPropsRouter = require('./src/routes/extraProp.js');
const joinRouter = require('./src/routes/joinRequest.js');
const searchRouter = require('./src/routes/search.js');
const path = require('path');
const { fileURLToPath } = require('url');
const cors = require('cors');
const fs = require('fs');

// Configuration
dotenv.config();
connection();

// Express
const app = express();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Global Middlewares
app.use(cors());
app.use(express.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'src/utils'));

// Endpoint to render the EJS template
app.get('/orderEmail', (req, res) => {
  // Example data (replace with your actual data)

  const user = {
    full_name: 'محمد محمود',
    username: 'mohamedM',
    email: 'hassaneymar11@gmail.com',
    image: ['profie.jpg'],
    phone_number: null,
  };
  const company = {
    full_name: 'شركة فلاتر',
    username: 'amr12345',
    email: 'amr@gmail.con',
    image: ['user-1696011936779.jpeg'],
    phone_number: null,
  };

  const service = {
    title: 'صيانة بوتاجازات',
    description:
      'توفر الشركة العالمية لصيانة وتصليح البوتاجازات مجموعة من الفنيين المهرة والمدربين على أعلى مستوي كما توفر لهؤلاء الفنيين أحدث المعدات وذلك للقيام بصيانة البوتاجاز على أفضل نحو وبأسرع وقت وأعلى جودة.',
    price: 500,
    images: ['service-1696024568617.jpeg'],
    props: ['صيانة جميع انواع البوتاجازات'],
  };

  const extra_props = [
    {
      price: 500,
      description: 'صيانة فورى',
    },
  ];

  const total_price = 1000;
  // Render the EJS template and send it as the response
  res.render('baseEmail', { user, service, company, extra_props, total_price });
});

// Define a route to send the blob image
app.post('/image', (req, res) => {
  // Get the image path from the query parameter
  const imagePath = req.body.path;

  if (!imagePath) {
    return res.status(400).json({ error: 'Image path is missing' });
  }

  // Read the image file as a binary buffer
  const imageBuffer = fs.readFileSync(path.join(__dirname, `uploads/${imagePath}`));

  // Determine the MIME type based on the file extension
  const extension = path.extname(imagePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.webp': 'image/webp',
    '.tiff': 'image/tiff',
    '.tif': 'image/tiff',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    // '.pdf': 'application/pdf',
    '.jp2': 'image/jp2',
    // '.webm': 'video/webm',
    // Add more image types as needed
  };

  // Set the appropriate content type in the response header
  res.setHeader('Content-Type', mimeTypes[extension] || 'application/octet-stream');

  // Send the image buffer as the response
  res.send(imageBuffer);
});

// Routes
// app.use('/offers_api', () => {
//   res.send('helloooooooooooooooooooooooooooooo');
// });
app.use('/order', orderRouter);
app.use('/service', servicesRouter);
app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use('/extraProp', extraPropsRouter);
app.use('/auth', authRouter);
app.use('/join', joinRouter);
app.use('/search', searchRouter);
app.use('/company', companyRouter);

// Not Found
app.all('*', (req, res, next) => {
  next(new ErrorAPI(`Can't find this route: ${req.originalUrl}`, 404));
});

// Error middleware
app.use(globalError);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`app listening on port : ${PORT} `);
});
