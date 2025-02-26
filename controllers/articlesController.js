const { get } = require("mongoose");
const Article = require("../models/Article");
const Comment = require("../models/Comment");
const redis = require('redis');
const client = require('../redis/redis');
const axios = require('axios');

//get article by id controller
// const article_get_byId = (req, res) => {
//   const articleId = req.params.articleId;
//   Article.findOne({ _id: articleId })
//     .then((article) => {
//       if (!article) {
//         // If the article is not found, return a 404 Not Found response
//         return res.status(404).json({ message: "Article not found" });
//       }

//       // If the article is found, return a 200 OK response with the article data
//       res.status(200).json(article);
//     })
//     .catch((error) => {
//       // Handle any errors that occur during the database query
//       console.error(error);
//       res.status(500).json({ message: "Internal Server Error" });
//     });
// };



//redis cached data
const article_get_byId = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    console.log(articleId)
    const cacheKey = 'articles';

    // Check if the list of articles exists in the cache
    let articles = await client.get(cacheKey);
    
    if (!articles) {
      // If the list of articles doesn't exist in the cache, fetch all articles from the database
      articles = await Article.find({});
      
      if (!articles || articles.length === 0) {
        return res.status(404).json({ message: "No articles found" });
      }

      // Store the fetched articles in the cache
      await client.set(cacheKey, JSON.stringify(articles));
      console.log(`Articles set into Redis cache`);
    } else {
      console.log(`Retrieving articles from Redis cache`);
      articles = JSON.parse(articles);
    }

    // Find the requested article from the list
    const article = articles.find(article => article._id == articleId);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Send the article as a response
    res.status(200).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// fetch articles from NewYorkTimes API
const fetchArticlesFromAPI = async () => {
  console.log("Fetching articles from NewYorkTimes API...");
  const api_key = "K0tpM23AaQUj7ByqRdNUg009v8r5dg3f";
  const url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=technology&api-key='+api_key+'&page=1&sort=newest';
  // use axios to fetch data from the API
  const response = await axios.get(url);
  const data = response.data.response.docs;

  const articles = data.map((article) => {
    
    return {
      title: article.headline.main,
      content: article.abstract,
      author_name: article.byline.original,
      date_of_publish: article.pub_date,
      tags: article.keywords.map((keyword) => keyword.value),
      article_link: article.web_url,
      image_link: article.multimedia[0] ? `https://www.nytimes.com/${article.multimedia[0].url}` : '',
    }
  });

  // console.log(articles);
  return articles;
};


//get articles by topic and page controller
// const articles_get_byTopicAndPage = (req, res) => {
//   //pagination in backend
//   const topic = req.params.topic;
//   const page = req.params.page;
//   const articlesPerPage = 9;
//   Article.find({ topic: topic })
//     .skip((page - 1) * articlesPerPage)
//     .limit(articlesPerPage)
//     .then((articles) => {
//       res.status(200).json(articles);
//     })
//     .catch((err) => {
//       res.status(500).json({ message: "Internal Server Error" });
//     });
// };


const articles_get_byTopicAndPage = async (req, res) => {
  try {

    console.log("here")
    // Pagination in the backend
    const topic = req.params.topic;
    const page = req.params.page;
    const articlesPerPage = 9;
    const cacheKey = 'articles';

    if (topic == "news_updates"){
      const articles = await fetchArticlesFromAPI();
      return res.status(200).json(articles);
    }
     let articles = await Article.find({ topic: topic });
      // Store the fetched articles in the cache
    // Perform pagination on the cached articles
    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const paginatedArticles = articles.slice(startIndex, endIndex);
    await client.del(cacheKey);

    // Send the paginated articles as a response
    res.status(200).json(paginatedArticles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};







//get all articles controller
const articles_get = async (req, res) => {
  const cacheKey = 'articles';
  let articles = await client.get(cacheKey);
 
  if (!articles) {
    console.log('Data not found in Redis cache, fetching from database...');
    Article.find({})
      .then((articles) => {
        // Store articles array as a JSON string in the Redis cache
        client.set(cacheKey, JSON.stringify(articles));
        console.log('Articles data set into Redis cache');
        // console.log(articles);
        res.status(200).json(articles);
      })
      .catch((err) => {
        console.error('Error fetching articles from database:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      });
  } else {
    // Parse the JSON string retrieved from the Redis cache
    articles = JSON.parse(articles);
    console.log('Articles data fetched from Redis cache');
    // console.log(articles);
    res.status(200).json(articles);
  }
};



//delete article controller
const deleteArticle =async  (req, res) => {
  const { articleid } = req.params;

  // Use the findByIdAndDelete method provided by Mongoose
  
  Article.findByIdAndDelete(articleid)
    .then((deletedArticle) => {
      if (deletedArticle) {
        const cachekey='articles'
        client.del(cachekey).then(()=>{
          res.json({ message: "Article deleted successfully", status: true });
        })
        

      } else {
        res.status(404).json({ error: "Article not found", status: false });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal server error", status: false });
    });
};

//filter handler controller
const filterHandler = async (req, res) => {
  //based on search input filter the articles
  let { searchinput, based_on, filter_option, topic } = req.body;
  console.log(req.body);
  let topic_lower = topic.toLowerCase();
  search_value = searchinput.toLowerCase();
  let sort_basis = -1;
  if (filter_option == "oldest first") sort_basis = 1;
   //if filter option is most liked then sort the articles based on likes
   
  if (filter_option == "most liked") {
    Article.find({ topic: topic_lower })
      .sort({ likes: -1 })
      .then((data) => {
        let slider_data = data;
        slider_data.sort((a, b) => b.likes - a.likes);
        slider_data = slider_data.slice(0, Math.min(5, slider_data.length));
        // console.log(slider_data);
        const filtered_data = data.filter((article) => {
          //if based on title then filter the articles based on title
          if (
            based_on == "title" &&
            article.title.toLowerCase().includes(search_value.toLowerCase())
          )
            return true;
            //if based on tags then filter the articles based on tags
          else if (based_on == "tags") {
            const tags = article.tags;
            for (let i = 0; i < tags.length; i++) {
              if (tags[i].toLowerCase().includes(search_value.toLowerCase()))
                return true;
            }
          }
        });
        // console.log(filtered_data)
        res.json({ success: true, filtered_data });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    console.log(sort_basis, "...");
    //if filter option is not most liked then sort the articles based on date of publish
    Article.find({ topic: topic_lower })
      .sort({ date_of_publish: sort_basis })
      .then((data) => {
        let slider_data = data;
        // console.log(slider_data);
        const filtered_data = data.filter((article) => {
          //if based on title then filter the articles based on title
          if (
            based_on == "title" &&
            article.title.toLowerCase().includes(search_value)
          )
            return true;
            //if based on tags then filter the articles based on tags
          else if (based_on == "tags") {
            const tags = article.tags;
            for (let i = 0; i < tags.length; i++) {
              if (tags[i].toLowerCase().includes(search_value)) return true;
            }
          }
        });
        // console.log(filtered_data[0]._id);
        res.json({ success: true, filtered_data });
      })
      .catch((err) => {
        console.log(err);
        res.json({ success: "false" });
      });
  }
};



//post article controller
// const article_post = async (req, res) => {
//   const articleId = req.query.id;
//   const {
//     topic,
//     title,
//     content,
//     author_name,
//     date_of_publish,
//     tags,
//     author_id,
//     image_link,
//   } = req.body;
//   console.log(req.body);
//   console.log(req.query);
//   if (articleId) {
//     const article = await Article.findById(articleId);
//     article.topic = topic;
//     article.title = title;
//     article.content = content;
//     article.author_name = author_name;
//     article.date_of_publish = date_of_publish;
//     article.tags = tags;
//     article.author_id = author_id;
//     article.image_link = image_link;
//     await article.save();
//     console.log("Article updated successfully");
//     res.status(200).json({ message: "Article updated successfully" });
//   } else {
//     const article = new Article({
//       topic,
//       title,
//       content,
//       author_name,
//       date_of_publish,
//       tags,
//       author_id,
//       image_link,
//     });
//     await article.save();
//     console.log("Article added successfully");
//     res.status(200).json({ message: "Article added successfully" });
//   }
// };

const article_post = async (req, res) => {
  const articleId = req.query.id;
  const {
    topic,
    title,
    content,
    author_name,
    date_of_publish,
    tags,
    author_id,
    image_link,
  } = req.body;
  console.log(req.body);

  if (articleId) {
    try {
      const article = await Article.findById(articleId);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      article.topic = topic;
      article.title = title;
      article.content = content;
      article.author_name = author_name;
      article.date_of_publish = date_of_publish;
      article.tags = tags;
      article.author_id = author_id;
      article.image_link = image_link;
      await article.save();
      console.log("Article updated successfully");

      // Clear or update the cached articles
      await clearArticleCache();
      
      res.status(200).json({ message: "Article updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    try {
      const article = new Article({
        topic,
        title,
        content,
        author_name,
        date_of_publish,
        tags,
        author_id,
        image_link,
      });
      await article.save();
      console.log("Article added successfully");

      // Clear or update the cached articles
      await clearArticleCache();
      
      res.status(200).json({ message: "Article added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

// Helper function to clear the cached articles
const clearArticleCache = async () => {
  const cacheKey = 'articles';
  await client.del(cacheKey);
  console.log("Cached articles cleared");
};



//like  controller
const liked = async (req, res) => {
  let articleid = req.params.articleid;
  let userid = req.body.userid;
  const cachedKey = 'articles';
  await client.del(cachedKey);
  Article.find({ _id: articleid })
    .then((data) => {
      newarray1 = data[0].liked_userids;
      likes = data[0].likes;
      dislikes = data[0].dislikes;
      let index = newarray1.includes(userid);
      if (index == true) {
      } else {
        ++likes;

        newarray1.push(userid);
      }
      newarray2 = data[0].disliked_userids;
      index = newarray2.includes(userid);
      if (index == true) {
        --dislikes;

        newarray2 = newarray2.filter((fruit) => fruit !== userid);
      } else {
      }
      Article.updateOne(
        { _id: articleid },
        {
          $set: {
            likes: parseInt(likes),
            dislikes: parseInt(dislikes),
            liked_userids: newarray1,
            disliked_userids: newarray2,
          },
        }
      ).then(() => {
        res.json({ success: true });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};








const disliked = async (req, res) => {
  articleid = req.params.articleid;
  userid = req.body.userid;
  const cachedKey = 'articles';
  await client.del(cachedKey);
  Article.find({ _id: articleid })
    .then((data) => {
      // console.log(data)
      newarray1 = data[0].disliked_userids;
      // console.log(newarray1)
      likes = data[0].likes;
      dislikes = data[0].dislikes;
      // console.log(userid)
      // console.log(newarray1.includes(userid))
      let index = newarray1.includes(userid);
      // console.log(likes, dislikes);
      if (index == true) {
        // console.log('disliked before')
      } else {
        ++dislikes;
        // console.log('disliked now')
        newarray1.push(userid);
      }
      newarray2 = data[0].liked_userids;
      index = newarray2.includes(userid);
      if (index == true) {
        --likes;
        // console.log('liked before removing')
        newarray2 = newarray2.filter((fruit) => fruit !== userid);
        // console.log(newarray2)
      } else {
        // console.log('not available in likes')
      }
      Article.updateOne(
        { _id: articleid },
        {
          $set: {
            likes: parseInt(likes),
            dislikes: parseInt(dislikes),
            liked_userids: newarray2,
            disliked_userids: newarray1,
          },
        }
      ).then(() => {
        // console.log('successfully updated');
        res.json({ success: true });
      });

      //    Article.updateOne({_id:articleid},{$set:{}})
    })
    .catch((err) => {
      console.log(err);
    });
};







//get comments controller
const getComments = async (req, res) => {
  try {
    const articleId = req.params.articleId;

    // Step 1: Fetch main comments
    const mainComments = await Comment.find({
      article_id: articleId,
      is_main_comment: true,
    });

    // Step 2: Fetch reply comments for each main comment
    const mainCommentsWithReplies = await Promise.all(
      mainComments.map(async (mainComment) => {
        const replies = await Comment.find({
          _id: { $in: mainComment.replies_ids },
        });
        return { ...mainComment.toObject(), replies };
      })
    );

    // Step 3: Send the response
    res.send(mainCommentsWithReplies);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


//post comment controller
const postComment = async (req, res) => {
  const { articleId } = req.params;
  const {
    user_id,
    comment_info,
    profile_image_link,
    user_name,
    is_main_comment,
    reply_for,
    main_comment_id,
  } = req.body;
  console.log(req.body);
  // Step 1: Create a new comment
  const newComment = new Comment({
    article_id: articleId,
    user_id,
    comment_info,
    profile_image_link,
    user_name,
    is_main_comment,
    reply_for,
    main_comment_id,
  });

  // Step 2: Save the new comment
  const savedComment = await newComment.save();

  // // Step 3: If the comment is a reply, update the replies_ids array of the main comment
  if (!is_main_comment) {
    await Comment.findByIdAndUpdate(main_comment_id, {
      $push: { replies_ids: savedComment._id },
    });
  }

  res.send({
    message: "Comment posted successfully",
  });
};

//delete comment controller
const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const { is_main_comment, main_comment_id } = req.body;
  if (is_main_comment) {
    await Comment.findByIdAndDelete(commentId);
    // delete all its replies
    await Comment.deleteMany({ main_comment_id: commentId });
  } else {
    console.log(main_comment_id);
    await Comment.findByIdAndDelete(commentId);
    await Comment.findByIdAndUpdate(main_comment_id, {
      $pull: { replies_ids: commentId },
    });
  }

  res.send({
    message: "Comment deleted successfully",
  });
};


//exporting all the controllers
module.exports = {
  article_get_byId,
  articles_get_byTopicAndPage,
  articles_get,
  deleteArticle,
  filterHandler,
  article_post,
  liked,
  disliked,
  getComments,
  postComment,
  deleteComment,
};
