const router = require("express").Router();
const utilitycontroller = require("../controllers/utilitycontroller");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

/**
 * @swagger
 * /utility/contact:
 *   post:
 *     summary: Submit contact form
 *     description: Submit a contact form with user details and message
 *     security:
 *       - bearerAuth: []
 *     tags: [utility]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactForm'
 *     responses:
 *       200:
 *         description: Contact form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the contact form was submitted successfully
 *                   example: true
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the contact form submission encountered an error
 *                   example: false
 * components:
 *   schemas:
 *     ContactForm:
 *       type: object
 *       properties:
 *         firstname:
 *           type: string
 *           description: The first name of the user submitting the contact form
 *         lastname:
 *           type: string
 *           description: The last name of the user submitting the contact form
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user submitting the contact form
 *         message:
 *           type: string
 *           description: The message submitted through the contact form
 *         phone:
 *           type: string
 *           description: The phone number of the user submitting the contact form
 */

router.post("/contact", authMiddleware, utilitycontroller.contact_us);

/**
 * @swagger
 * /utility/queries:
 *   get:
 *     summary: Get all unresolved queries
 *     description: Retrieve all unresolved queries
 *     security:
 *       - bearerAuth: []
 *     tags: [utility]
 *     parameters:
 *       - in: query
 *         name: isresolved
 *         schema:
 *           type: boolean
 *         description: Filter queries by resolved status (optional)
 *     responses:
 *       200:
 *         description: Queries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Query'
 *       403:
 *         description: Forbidden. Only admin users can access this endpoint.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the user is not authorized to access this endpoint
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating an internal server error
 * components:
 *   schemas:
 *     Query:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the query
 *         firstname:
 *           type: string
 *           description: The first name of the user submitting the query
 *         lastname:
 *           type: string
 *           description: The last name of the user submitting the query
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user submitting the query
 *         message:
 *           type: string
 *           description: The message submitted in the query
 *         phone:
 *           type: string
 *           description: The phone number of the user submitting the query
 *         isresolved:
 *           type: boolean
 *           description: Indicates whether the query has been resolved or not
 */

router.get(
  "/queries",
  authMiddleware,
  roleMiddleware(["admin"]),
  utilitycontroller.all_queries
); //only admin can view contactus queries.

/**
 * @swagger
 * /utility/queries/{id}:
 *   put:
 *     summary: Mark query as resolved
 *     description: Mark a query as resolved by its ID
 *     security:
 *       - bearerAuth: []
 *     tags: [utility]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the query to mark as resolved
 *     responses:
 *       200:
 *         description: Query marked as resolved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the query was marked as resolved successfully
 *                   example: true
 *       404:
 *         description: Query not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the query was found
 *                   example: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether an error occurred while marking the query as resolved
 *                   example: false
 */

router.put("/query/:id", authMiddleware, utilitycontroller.postquery);

module.exports = router;
