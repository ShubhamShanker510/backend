import multer from "multer"; // Import multer for handling file uploads

// Configure storage for multer
const storage = multer.diskStorage({
    // Specify the destination directory for uploaded files
    destination: function (req, file, cb) {
        cb(null, "./public/temp"); // Save files in './public/temp' directory
    },
    // Specify the filename for uploaded files
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique suffix using current timestamp and a random number
        cb(null, file.fieldname + '-' + uniqueSuffix); // Append unique suffix to the original filename
    }
});

// Create an instance of multer with the storage configuration
const upload = multer({ storage: storage });

export default upload; // Export the multer instance
