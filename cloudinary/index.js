const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_KEY,
   api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
   cloudinary,
   params: {
      folder: (req, file) => {
         if (req.url == "/products")
            return 'dragonessa/products'
         if (req.url.includes("PUT") || req.url.includes("/products/"))
            return 'dragonessa/products'
      },
      allowedFormats: ['jpeg', 'jpg', 'png']
   }
});

module.exports = {
   cloudinary, 
   storage
}