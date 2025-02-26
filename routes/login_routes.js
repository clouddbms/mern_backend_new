const router = require("express").Router();
const authController = require("../controllers/authController");
const { resumeUpload } = require("../middleware/fileHandleMiddleware");
const upload = require("../utility/multer");
const csrf=require('csurf')
const crsfProtection=csrf({
    cookie: true
});
 
// router.use(crsfProtection)

/**
 * @swagger
 * /log/login:
 *   post:
 *     summary: Login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       403:
 *         description: Invalid credentials
 *       500:
 *         description: Logging in failed
 */


router.post("/login", authController.login_post);
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - pswd
 *         - fname
 *         - lastname
 *         - registeras
 *         - phno
 *       properties:
 *         email:
 *           type: string
 *           description: Email of the user
 *         pswd:
 *           type: string
 *           description: Password of the user
 *         fname:
 *           type: string
 *           description: First name of the user
 *         lastname:
 *           type: string
 *           description: Last name of the user
 *         registeras:
 *           type: string
 *           description: Type of registration (user or expert)
 *         phno:
 *           type: string
 *           description: Phone number of the user
 */



/**
 * @swagger
 * /log/register:
 *   post:
 *     summary: Register a User or Expert
 *     description: Register a new user or expert account.
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - fname
 *               - lastname
 *               - email
 *               - pswd
 *               - phno
 *               - registeras
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: The resume file for expert registration.
 *               fname:
 *                 type: string
 *                 description: First name of the user or expert.
 *               lastname:
 *                 type: string
 *                 description: Last name of the user or expert.
 *               email:
 *                 type: string
 *                 description: Email address of the user or expert.
 *               pswd:
 *                 type: string
 *                 description: Password for the user or expert account.
 *               phno:
 *                 type: string
 *                 description: Phone number of the user or expert.
 *               registeras:
 *                 type: string
 *                 enum: [user, expert]
 *                 description: Type of account to register ("user" or "expert").
 *     responses:
 *       201:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                   description: ID of the registered user.
 *                 expert:
 *                   type: string
 *                   description: ID of the registered expert.
 *                 data:
 *                   type: object
 *                   description: Details of the registered user.
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: object
 *                   description: Error object indicating the cause of the bad request.
 *     tags:
 *       - Authentication
 */








router.post("/register",upload.single("resume"),resumeUpload, authController.register_post);
router.get('/csrf-token', authController.getCSRFToken)
module.exports = router;
