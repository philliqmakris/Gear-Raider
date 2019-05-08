const auth = require('../middleware/auth');
// const Joi = require('joi');
const db = require("../models/index");
const express = require('express');
const router = express.Router();

// get all reviews or by product or username
router.get('/:page', (req, res) => {
  let page = parseInt(req.params.page) || 1;
  const product = req.query.product;
  const user = req.query.user;

  const options = {
    include: [
      {
        model: db.User,
        through: {
          attributes: ['username', 'id'],
        },
      },
    ],
  };

  if (product) options.where.product = product;
  if (user) options.where.userId = user;

  sendReviews(options, page);  
});

// create a review
router.post('/', auth, async (req, res) => {
  // const { error } = validate(req.body.review);
  // if (error) return res.status(400).json(error.details[0].message);

  const review = req.body;
  review.userId = req.user.id;

  const review = await db.Review.create(review);

  res.status(200).json(review);
});


// handles pagination and sends query result; broken out in case we have multiple get handlers
sendReviews(moreOptions, page) {
  const limit = 20;
  let offset = (page - 1) * limit;

  let options = {
    attributes: ['id', 'product', 'rating', 'imgUrl'],
    limit,
    offset,
    $sort: { id: 1 },
  };

  if (moreOptions) options = Object.assign(options, moreOptions);

  const result = await db.Review.findAndCountAll(options);
  if (!result || !result.reviews || !result.reviews[0]) return res.status(404).json('No reviews found.');
  
  const pages = Math.ceil(result.count / limit);
  const end = result.count < limit;
  const reviews = result.rows;

  res.status(200).json({ reviews, 'count': result.count, pages, endFlag });
}

// function validate(review) {
//     const schema = {
//       username: Joi.string().min(5).max(50).required(),
//       email: Joi.string().min(5).max(255).required().email(),
//       password: Joi.string().min(5).max(255).required()
//     };

//     return Joi.validate(this, schema);
//   }

module.exports = router;