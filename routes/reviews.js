const validator = require('validator');
const auth = require('../middleware/auth');
const db = require("../models/index");
const Op = db.Sequelize.Op;
const express = require('express');
const router = express.Router();

// get all reviews or by product or username
router.get('/', (req, res) => {
  let page = parseInt(req.query.page) || 1;
  const product = req.query.product;
  const userId = req.query.userId;

  const options = {
    include: [
      {
        model: db.User,
        attributes: { exclude: 'password' },
        nested: true,
      },
    ],
    where: {},
  };

  if (userId) options.where.userId = userId;
  if (product) options.where.product = {
    [Op.like]: '%' + product + '%',
  };

  sendReviews(res, options, page);
});


// create a review
router.post('/', auth, async (req, res) => {
  let review = req.body;
  review.userId = req.user.id;

  // validation
  if (!(
    // validator.isURL(review.imgUrl + '', { protocols: ['http','https'] })
    validator.isInt(review.rating + '', { min: 0, max: 5, allow_leading_zeroes: false })
    && validator.isLength(review.text + '', { min:6, max: 1023 })
  )) return res.status(400).json('Invalid review');

  for (let prop in review) {
    if (typeof review[prop] === 'object') return res.status(400).json('Reviews may not contain nested data.');
  }

  // sanitize text
  review.text = validator.escape(review.text.trim());
  review.product = validator.escape(review.product.trim());

  review = await db.Review.create(review);
  res.status(200).json(review);
});


// handles pagination and sends query result; broken out in case we need multiple get handlers
async function sendReviews(res, options, page) {
  const limit = 20;
  let offset = (page - 1) * limit;

  let allOptions = {
    limit,
    offset,
    $sort: { id: 1 },
  };

  if (options) allOptions = Object.assign(allOptions, options);

  const result = await db.Review.findAndCountAll(allOptions);
  const reviews = result.rows;

  if (reviews.length === 0) return res.status(200).json('No reviews found.');
  
  const pages = Math.ceil(result.count / limit);

  res.status(200).json({ reviews, 'count': result.count, pages });
}

module.exports = router;