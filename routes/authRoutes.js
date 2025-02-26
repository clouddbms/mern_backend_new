const router = require("express").Router();
const authController = require("../controllers/authController");
const upload = require("../utility/multer");
const { resumeUpload } = require("../middleware/fileHandleMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/googleSignIn", authController.googleSignIn_post);


/**
 * @swagger
 * /auth/checkEmail/{email}:
 *   get:
 *     summary: Check if email is already registered
 *     description: Check if the provided email is already registered by a user, expert, or admin.
 *     parameters:
 *       - in: path
 *         name: email
 *         description: The email address to check.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indicating whether the email is registered or not.
 *                 status:
 *                   type: boolean
 *                   description: Status indicating whether the email is registered (true) or not (false).
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the internal server error.
 *     tags:
 *       - Authentication
 */

router.get("/checkEmail/:email", authController.checkEmail_get);
/**
 * @swagger
 * /auth/{expertid}:
 *   delete:
 *     summary: Delete an expert by ID
 *     description: Delete an expert from the database using its unique identifier (ID).
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: expertid
 *         description: ID of the expert to delete.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indicating that the expert was deleted successfully.
 *                 status:
 *                   type: boolean
 *                   description: Status indicating the success of the deletion operation.
 *       404:
 *         description: Expert not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the expert was not found.
 *                 status:
 *                   type: boolean
 *                   description: Status indicating the failure to find the expert.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating the internal server error.
 *                 status:
 *                   type: boolean
 *                   description: Status indicating the internal server error.
 *     tags:
 *       - Admin
 */

router.delete("/:expertid",authMiddleware,roleMiddleware(["admin"]), authController.remove_Expert); // restrict to admin.
/**
 * @swagger
 * /auth/{expertid}/updateblocked:
 *   put:
 *     summary: Toggle the blocked state of an expert
 *     description: Toggle the blocked state of an expert by updating the `is_blocked` property in the database.
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: expertid
 *         description: ID of the expert to update.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Status indicating the success of the operation.
 *                 expert:
 *                   $ref: '#/components/schemas/Expert'
 *       404:
 *         description: Expert not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the expert was not found.
 *                 status:
 *                   type: boolean
 *                   description: Status indicating the failure to find the expert.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating the internal server error.
 *                 status:
 *                   type: boolean
 *                   description: Status indicating the internal server error.
 *     tags:
 *       - Admin
 */

router.put("/:expertid/updateblocked",authMiddleware,roleMiddleware(["admin"]), authController.updateblockedstate); //restrict to admin.
/**
 * @swagger
 * /auth/forgotpassword:
 *   post:
 *     summary: Send OTP for password reset
 *     description: Send an OTP (One-Time Password) to the user's email for password reset.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user requesting password reset.
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Status indicating the success of sending the OTP.
 *                 data:
 *                   type: string
 *                   description: The generated OTP.
 *                 type:
 *                   type: string
 *                   description: Type of user (either "user" or "expert").
 *       400:
 *         description: Incorrect email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Status indicating the failure to find the user.
 *                 data:
 *                   type: string
 *                   description: Error message indicating that the email is not registered.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Status indicating the internal server error.
 *                 data:
 *                   type: string
 *                   description: Error message indicating the internal server error.
 *     tags:
 *       - Authentication
 */

router.post("/forgotpassword", authController.forgotpassword);
/**
 * @swagger
 * /auth/passwordchange:
 *   post:
 *     summary: Change Password
 *     description: Change the password for a user or expert account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user or expert.
 *               newPassword:
 *                 type: string
 *                 description: The new password to be set.
 *               type:
 *                 type: string
 *                 description: Type of account (either "user" or "expert").
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Status indicating the success of password change.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Status indicating the internal server error.
 *     tags:
 *       - Authentication
 */

router.post("/passwordchange", authController.changepassword);
module.exports = router;
