const router = require("express").Router();
const queriesController = require("../controllers/queriesController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Faq:
 *       type: object
 *       required:
 *         - user_id
 *         - topic
 *         - question
 *       properties:
 *         user_id:
 *           type: string
 *           description: The ID of the user asking the question
 *         topic:
 *           type: string
 *           description: The topic/category of the question
 *         popularity:
 *           type: number
 *           description: The popularity score of the question
 *         question:
 *           type: string
 *           description: The actual question being asked
 *         answer:
 *           type: string
 *           description: The answer to the question
 *         profile-image-link:
 *           type: string
 *           description: The link to the profile image of the user asking the question
 *         is_answered:
 *           type: boolean
 *           description: A flag indicating whether the question has been answered
 *         expert_id:
 *           type: string
 *           description: The ID of the expert who answered the question
 */

/**
 * @swagger
 * /queries/:
 *   get:
 *     summary: Retrieve all FAQs
 *     description: Retrieve a list of all frequently asked questions (FAQs) stored in the database
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of FAQs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Faq'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the internal server error
 *     tags:
 *       - FAQs
 */

router.get("/", authMiddleware, queriesController.faq_get);
/**
 * @swagger
 * /queries/filters:
 *   post:
 *     summary: Filter FAQs
 *     description: Filter frequently asked questions (FAQs) based on various criteria such as solved status, topic, and search value
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_solved:
 *                 type: string
 *                 enum: [true, false]
 *                 description: Indicates whether the FAQ is solved or not
 *               all_or_your:
 *                 type: string
 *                 enum: [all, your, solved]
 *                 description: Indicates whether to filter all FAQs, user's FAQs, or solved FAQs
 *               choose_topic:
 *                 type: string
 *                 description: The topic to filter the FAQs
 *               search_value:
 *                 type: string
 *                 description: The search value to filter FAQs based on question content
 *               userId:
 *                 type: string
 *                 description: The ID of the user or expert for filtering user-specific or expert-specific FAQs
 *     responses:
 *       200:
 *         description: Filtered FAQs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Faq'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the internal server error
 *     tags:
 *       - FAQs
 */


router.post("/filters", authMiddleware, queriesController.faq_filters_post);
/**
 * @swagger
 * /queries/:
 *   post:
 *     summary: Add a new FAQ
 *     description: Add a new frequently asked question (FAQ) to the database
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: The ID of the user who asked the question
 *               topic:
 *                 type: string
 *                 description: The topic of the FAQ
 *               question:
 *                 type: string
 *                 description: The question being asked
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating the question was added successfully
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the internal server error
 *     tags:
 *       - FAQs
 */

router.post("/", authMiddleware, queriesController.faq_post);
/**
 * @swagger
 * /queries/answer:
 *   post:
 *     summary: Add an answer to a FAQ
 *     description: Add an answer to a frequently asked question.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               faq_id:
 *                 type: string
 *                 description: The ID of the FAQ to answer.
 *               expert_id:
 *                 type: string
 *                 description: The ID of the expert providing the answer.
 *               answer:
 *                 type: string
 *                 description: The answer to the FAQ.
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indicating the answer was added successfully.
 *     tags:
 *       - FAQs
 */


//Answer post for FAQ controller
router.post(
  "/answer",
  authMiddleware,
  roleMiddleware(["expert", "admin"]),
  queriesController.faq_answer_post
); //only expert and admin can answer.


/**
 * @swagger
 * /queries/email:
 *   post:
 *     summary: Send email to members
 *     description: Allows an admin user to send email to members.
 *     security:
 *       - bearerAuth: []  # Include bearerAuth as security requirement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *                 description: The subject of the email.
 *               message:
 *                 type: string
 *                 description: The content of the email.
 *               experts:
 *                 type: boolean
 *                 description: Whether to include emails of experts.
 *               users:
 *                 type: boolean
 *                 description: Whether to include emails of users.
 *     responses:
 *       200:
 *         description: Email sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the email was sent successfully.
 *       403:
 *         description: Forbidden. User does not have permission to access the route.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the user is not authorized.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating internal server error.
 *     tags:
 *       - Admin
 */




router.post(
  "/email",
  authMiddleware,
  roleMiddleware(["admin"]),
  queriesController.email_members
); //only admin can email members.

module.exports = router;
