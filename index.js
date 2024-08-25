require('dotenv').config()
const express = require('express');
const registrationController = require('./controller/registrationController');
const secureApi = require('./middleware/secureApi');
const dbConnection = require('./helper/db_connection');
const loginController = require('./controller/loginController');
const emailValidationController = require('./controller/emailValidationController');
const { blogPostController, authorWithPost, categoryWithPosts, postByCategory, deletePost, updateAPost } = require('./controller/blogPostController');
const getAllBlogController = require('./controller/getAllBlogController');
const app = express();
dbConnection();
const multer = require("multer");
const { createCategory, getCategories, deleteCategory, editCategory } = require('./controller/categoryController');
app.use(express.json())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + file.originalname)
    }
})

const upload = multer({ storage: storage })

app.get('/', function (req, res, next) {
    res.send("Hello World!")
})

app.post('/registration', secureApi, registrationController)
app.post('/login', secureApi, loginController)

app.post('/categories', secureApi, createCategory)
app.get('/categories', secureApi, getCategories)
app.put('/categories/:id', secureApi, editCategory)
app.delete('/categories/:id', secureApi, deleteCategory)

app.post('/blogs', secureApi, upload.single('avatar'), blogPostController)
app.post('/blogs', secureApi, upload.single('avatar'), blogPostController)
app.get('/blogs', secureApi, getAllBlogController)
app.post('/blogs-update/:id', secureApi, upload.single('avatar'), updateAPost)
app.delete('/blogs-delete/:id', secureApi, deletePost)
app.post('/category-with-posts', secureApi, categoryWithPosts)
app.post('/author-with-posts', secureApi, authorWithPost)
app.post('/post-by-category/:id', secureApi, postByCategory)



app.get('/:email', emailValidationController)

app.listen(process.env.PORT)