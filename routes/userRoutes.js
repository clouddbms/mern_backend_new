const router = require("express").Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const upload = require("../utility/multer");
const { handleImageUpload } = require("../middleware/fileHandleMiddleware");


/**
 * @swagger
 * /user/{userId}/bookmarks:
 *   get:
 *     summary: Get bookmarks by user ID
 *     description: Retrieve bookmarks for a user by their ID
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve bookmarks for
 *     responses:
 *       200:
 *         description: Retrieved bookmarks successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *       404:
 *         description: Bookmarks not found for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating that bookmarks were not found
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation
 *                   example: false
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
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation
 *                   example: false
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the article
 *         title:
 *           type: string
 *           description: The title of the article
 *         content:
 *           type: string
 *           description: The content of the article
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the article was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the article was last updated
 */

router.get(
  "/:userId/bookmarks",
  authMiddleware,
  userController.bookmarks_byUserId_get
);

/**
 * @swagger
 * /user/{userId}/yourwork:
 *   get:
 *     summary: Get articles by user ID
 *     description: Retrieve articles authored by a user based on their ID
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve articles for
 *     responses:
 *       200:
 *         description: Retrieved articles successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *       404:
 *         description: Articles not found for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating that articles were not found
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation
 *                   example: false
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
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation
 *                   example: false
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the article
 *         title:
 *           type: string
 *           description: The title of the article
 *         content:
 *           type: string
 *           description: The content of the article
 *         author_id:
 *           type: string
 *           description: The ID of the author of the article
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the article was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the article was last updated
 */

router.get(
  "/:userId/yourwork",
  authMiddleware,
  roleMiddleware(["expert", "admin"]),
  userController.articles_getbyuserid
); //only expert and admin can access this.

/**
 * @swagger
 * /user/{userId}/bookmarks/{articleId}:
 *   post:
 *     summary: Add a bookmark for an article by user ID
 *     description: Add a bookmark for a specific article by a user based on their IDs
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user adding the bookmark
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the article to be bookmarked
 *     responses:
 *       200:
 *         description: Bookmark added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating that the bookmark was added
 *       404:
 *         description: User or article not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the user or article was not found
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation
 *                   example: false
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
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation
 *                   example: false
 */

router.post(
  "/:userId/bookmarks/:articleId",
  authMiddleware,
  userController.bookmark_add_byUserId_post
);

/**
 * @swagger
 * /user/{userId}/bookmarks/{articleId}:
 *   delete:
 *     summary: Remove a bookmark for an article by user ID
 *     description: Remove a bookmark for a specific article by a user based on their IDs
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user removing the bookmark
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the article to be unbookmarked
 *     responses:
 *       200:
 *         description: Bookmark removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating that the bookmark was removed
 *       404:
 *         description: User or article not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the user or article was not found
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation
 *                   example: false
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
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation
 *                   example: false
 */

router.delete(
  "/:userId/bookmarks/:articleId",
  authMiddleware,
  userController.bookmark_remove_byUserId_delete
);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users and experts
 *     description: Retrieve all users and experts from the database
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Users and experts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 experts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Expert'
 *       404:
 *         description: No users or experts found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating that no users or experts were found
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation
 *                   example: false
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
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation
 *                   example: false
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was last updated
 *     Expert:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the expert
 *         name:
 *           type: string
 *           description: The name of the expert
 *         expertise:
 *           type: string
 *           description: The area of expertise of the expert
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the expert was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the expert was last updated
 */

// write routes for getting update user by id, delete user by id
router.get("/", userController.users_get);

/**
 * @swagger
 * /user/role/{role}:
 *   get:
 *     summary: Get users by role
 *     description: Retrieve users based on their role
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *         description: The role of the users to retrieve (user, expert, admin)
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 oneOf:
 *                   - $ref: '#/components/schemas/User'
 *                   - $ref: '#/components/schemas/Expert'
 *                   - $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Invalid role provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that an invalid role was provided
 *       404:
 *         description: Users of the specified role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating that users of the specified role were not found
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation
 *                   example: false
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
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation
 *                   example: false
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was last updated
 *     Expert:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the expert
 *         name:
 *           type: string
 *           description: The name of the expert
 *         expertise:
 *           type: string
 *           description: The area of expertise of the expert
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the expert was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the expert was last updated
 *     Admin:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the admin
 *         name:
 *           type: string
 *           description: The name of the admin
 *         role:
 *           type: string
 *           description: The role of the admin
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the admin was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the admin was last updated
 */

router.get("/role/:role", userController.users_get_byRole);

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get user information by ID
 *     description: Retrieve user information by their ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve information for
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/User'
 *                 - $ref: '#/components/schemas/Expert'
 *                 - $ref: '#/components/schemas/Admin'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the user was not found
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation
 *                   example: false
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
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation
 *                   example: false
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was last updated
 *     Expert:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the expert
 *         name:
 *           type: string
 *           description: The name of the expert
 *         expertise:
 *           type: string
 *           description: The area of expertise of the expert
 *         totalLikes:
 *           type: integer
 *           description: The total number of likes received on all articles authored by the expert
 *         totalDislikes:
 *           type: integer
 *           description: The total number of dislikes received on all articles authored by the expert
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the expert was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the expert was last updated
 *     Admin:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the admin
 *         name:
 *           type: string
 *           description: The name of the admin
 *         role:
 *           type: string
 *           description: The role of the admin
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the admin was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the admin was last updated
 */

router.get("/:userId", userController.user_get_byId);

/**
 * @swagger
 * /user/email/{email}:
 *   get:
 *     summary: Get user information by email
 *     description: Retrieve user information by their email address
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The email address of the user to retrieve information for
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/User'
 *                 - $ref: '#/components/schemas/Expert'
 *                 - $ref: '#/components/schemas/Admin'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the user was not found
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation
 *                   example: false
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
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation
 *                   example: false
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was last updated
 *     Expert:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the expert
 *         name:
 *           type: string
 *           description: The name of the expert
 *         expertise:
 *           type: string
 *           description: The area of expertise of the expert
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the expert was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the expert was last updated
 *     Admin:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the admin
 *         name:
 *           type: string
 *           description: The name of the admin
 *         role:
 *           type: string
 *           description: The role of the admin
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the admin was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the admin was last updated
 */

router.get("/email/:email", userController.user_get_byEmail);

/**
 * @swagger
 * /user/{userId}:
 *   put:
 *     summary: Update user information by ID
 *     description: Update user information by their ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update information for
 *       - in: formData
 *         name: profile_picture
 *         type: file
 *         description: The profile picture of the user (optional)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           
 *     responses:
 *       200:
 *         description: User information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating that the user information was updated
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the user was not found
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation
 *                   example: false
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
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation
 *                   example: false
 */

router.put(
  "/:userId",
  authMiddleware,
  upload.single("profile_picture"),
  handleImageUpload,
  userController.user_update_byId_put
); //Route handles the PUT request for updating a users profile

module.exports = router;
