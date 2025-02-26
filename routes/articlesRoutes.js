const router = require("express").Router();
const articlesController = require("../controllers/articlesController");
const authMiddleware = require("../middleware/authMiddleware");
const { handleImageUpload } = require("../middleware/fileHandleMiddleware");
const upload = require("../utility/multer");
/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the article.
 *         topic:
 *           type: string
 *           description: The topic of the article.
 *         title:
 *           type: string
 *           description: The title of the article.
 *         content:
 *           type: string
 *           description: The content of the article.
 *         author_name:
 *           type: string
 *           description: The name of the author of the article.
 *         date_of_publish:
 *           type: string
 *           format: date-time
 *           description: The date when the article was published.
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of tags associated with the article.
 *         likes:
 *           type: integer
 *           description: The number of likes the article has received.
 *         dislikes:
 *           type: integer
 *           description: The number of dislikes the article has received.
 *         author_id:
 *           type: string
 *           description: The unique identifier of the author of the article.
 *         image_link:
 *           type: string
 *           description: The link to the image associated with the article.
 *         liked_userids:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of user IDs who have liked the article.
 *         disliked_userids:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of user IDs who have disliked the article.
 */

/**
 * @swagger
 * /articles/{articleId}:
 *   get:
 *     summary: Retrieve an article by ID
 *     description: Retrieve an article from the database using its unique identifier (ID)
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         description: ID of the article to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the article was not found
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
 *       - Articles
 */

router.get("/:articleId", authMiddleware, articlesController.article_get_byId);

router.get(
  "/topic/:topic/page/:page",
  authMiddleware,
  articlesController.articles_get_byTopicAndPage
);

/**
 * @swagger
 * /articles/:
 *   get:
 *     summary: Retrieve all articles
 *     description: Retrieve a list of all articles stored in the database
 *     responses:
 *       200:
 *         description: A list of articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *         example:
 *           - _id: "609a54d2c59a4b0c9a61f9e1"
 *             topic: "Technology"
 *             title: "Introduction to Artificial Intelligence"
 *             content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
 *             author_name: "John Doe"
 *             date_of_publish: "2023-05-12T10:30:00.000Z"
 *             tags: ["AI", "Machine Learning", "Deep Learning"]
 *             likes: 10
 *             dislikes: 2
 *             author_id: "609a54d2c59a4b0c9a61f9e0"
 *             image_link: "https://example.com/image.jpg"
 *             liked_userids: ["user123", "user456"]
 *             disliked_userids: ["user789"]
 *           - _id: "609a54e0c59a4b0c9a61f9e2"
 *             topic: "Science"
 *             title: "The Origin of Species"
 *             content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
 *             author_name: "Jane Smith"
 *             date_of_publish: "2023-06-20T09:45:00.000Z"
 *             tags: ["Biology", "Evolution"]
 *             likes: 15
 *             dislikes: 1
 *             author_id: "609a54e0c59a4b0c9a61f9e3"
 *             image_link: "https://example.com/image2.jpg"
 *             liked_userids: ["user123", "user789"]
 *             disliked_userids: ["user456"]
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
 *       - Articles
 */


router.get("/", articlesController.articles_get);
/**
 * @swagger
 * /articles/{articleid}:
 *   delete:
 *     summary: Delete an article by ID
 *     description: Delete an article from the database by its ID
 *     tags: [Articles]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleid
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the article to delete
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating that the article was deleted
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation
 *                   example: true
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the article was not found
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


router.delete("/:articleid", authMiddleware, articlesController.deleteArticle); // check whether only the writer / admin can delete the article.

/**
 * @swagger
 * /articles/filter:
 *   post:
 *     summary: Filter articles based on search input and criteria
 *     tags: [Articles]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               searchinput:
 *                 type: string
 *                 description: Search input used to filter articles
 *               based_on:
 *                 type: string
 *                 enum: [title, tags]
 *                 description: Criteria for filtering articles (title or tags)
 *               filter_option:
 *                 type: string
 *                 enum: [oldest first, most liked]
 *                 description: Option for sorting articles (oldest first or most liked)
 *               topic:
 *                 type: string
 *                 description: Topic to filter articles
 *     responses:
 *       200:
 *         description: Successfully filtered articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                 filtered_data:
 *                   type: array
 *                   description: Array of filtered articles
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 */

router.post("/filter", authMiddleware, articlesController.filterHandler);

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Create or update an article
 *     description: Create a new article or update an existing one
 *     tags: [Articles]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - title
 *               - content
 *               - author_name
 *               - date_of_publish
 *               - tags
 *               - author_id
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID of the article to update (optional)
 *               topic:
 *                 type: string
 *                 description: Topic of the article
 *               title:
 *                 type: string
 *                 description: Title of the article
 *               content:
 *                 type: string
 *                 description: Content of the article
 *               author_name:
 *                 type: string
 *                 description: Name of the author
 *               date_of_publish:
 *                 type: string
 *                 format: date
 *                 description: Date of publication
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags associated with the article
 *               author_id:
 *                 type: string
 *                 description: ID of the author
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file associated with the article (optional)
 *     responses:
 *       200:
 *         description: Article creation/update successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating that the article was created/updated successfully
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
 */




router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  handleImageUpload,
  articlesController.article_post
); // restrict this route to admin and expert.

/**
 * @swagger
 * /articles/comments/{articleId}:
 *   get:
 *     summary: Get comments for an article
 *     description: Retrieve main comments and their replies for a specific article
 *     tags: [Articles]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the article for which comments are requested
 *     responses:
 *       200:
 *         description: Successfully retrieved comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the main comment
 *                   content:
 *                     type: string
 *                     description: Content of the main comment
 *                   author:
 *                     type: string
 *                     description: Author of the main comment
 *                   replies:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: ID of the reply comment
 *                         content:
 *                           type: string
 *                           description: Content of the reply comment
 *                         author:
 *                           type: string
 *                           description: Author of the reply comment
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
 */


router.get(
  "/comments/:articleId",
  authMiddleware,
  articlesController.getComments
);
// /**
//  * @swagger
//  * /articles/comments/{articleId}:
//  *   post:
//  *     summary: Post a comment for an article
//  *     description: Post a new comment or reply for a specific article
//  *     tags: [Comments]
//  *     parameters:
//  *       - in: path
//  *         name: articleId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: ID of the article for which the comment is posted
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               user_id:
//  *                 type: string
//  *                 description: ID of the user posting the comment
//  *               comment_info:
//  *                 type: string
//  *                 description: Content of the comment
//  *               profile_image_link:
//  *                 type: string
//  *                 description: Link to the profile image of the user
//  *               user_name:
//  *                 type: string
//  *                 description: Name of the user posting the comment
//  *               is_main_comment:
//  *                 type: boolean
//  *                 description: Indicates whether the comment is a main comment or a reply
//  *               reply_for:
//  *                 type: string
//  *                 description: ID of the comment being replied to (if the comment is a reply)
//  *               main_comment_id:
//  *                 type: string
//  *                 description: ID of the main comment (if the comment is a reply)
//  *     responses:
//  *       200:
//  *         description: Comment posted successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   description: Success message indicating that the comment was posted successfully
//  *       500:
//  *         description: Internal server error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   description: Error message indicating an internal server error
//  */

router.post(
  "/comments/:articleId",
  authMiddleware,
  articlesController.postComment
); //Router used for posting the comment for specific article when a POST request is made

router.delete(
  "/comments/:commentId",
  authMiddleware,
  articlesController.deleteComment
); // check whether only the writer / admin can delete the comment.


/**
 * @swagger
 * /articles/liked/{articleid}:
 *   post:
 *     summary: Like or unlike an article
 *     description: Like or unlike a specific article by its ID
 *     tags: [Articles]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the article to like/unlike
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userid:
 *                 type: string
 *                 description: ID of the user liking/unliking the article
 *     responses:
 *       200:
 *         description: Article like/unlike successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
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
 */


router.post("/liked/:articleid", authMiddleware, articlesController.liked);

/**
 * @swagger
 * /articles/disliked/{articleid}:
 *   post:
 *     summary: Dislike or remove dislike from an article
 *     description: Dislike or remove dislike from a specific article by its ID
 *     tags: [Articles]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the article to dislike/remove dislike
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userid:
 *                 type: string
 *                 description: ID of the user disliking/removing dislike from the article
 *     responses:
 *       200:
 *         description: Article dislike/removal successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
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
 */

router.post(
  "/disliked/:articleid",
  authMiddleware,
  articlesController.disliked
);
module.exports = router;
