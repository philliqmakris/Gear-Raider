const auth = require('../middleware/auth');
const { User, Review } = require("../models");
const express = require('express');
const router = express.Router();

router.get('/:page', (req, res) => {
  let page = parseInt(req.params.page) || 1;
  const product = req.query.product;
  const user = req.query.user;

  const options = {
    include: [
      {
        model: User,
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


router.get('/me/:page', auth, (req, res) => {
  let page = req.params.page;
  const product = req.query.product;

  const options = {
    where: {
      userId: req.user.id,
    },
  };

  if (product) options.where.product = product;

  sendReviews(options, page);
});


router.get('/:id', async (req, res) => {
  const review = await Review.findOne({
    where: {
      id: req.params.id
    },
  });
  
  if (!review || !review[0]) return res.status(404).json(`Review not found.`);

  res.status(200).json(review);  
});


router.post('/', auth, async (req, res) => {
  // const { error } = validate(req.body);
  // if (error) return res.status(400).json(error.details[0].message);

  const review = req.body.review;
  review.userId = req.user.id;

  const review = await Review.create(review);

  res.status(200).json(review);
});

// router.put('/:id', auth, async (req, res) => {
//   // const { error } = validate(req.body); 
//   // if (error) return res.status(400).json(error.details[0].message);

//   console.log('reviews put')
// });

// router.delete('/:id', auth, async (req, res) => {
//   console.log('reviews delete')
// });

sendReviews(moreOptions, page) {
  const limit = 50;
  let offset = page * limit;

  let options = {
    attributes: ['id', 'product', 'rating', 'imgUrl'],
    limit,
    offset,
    $sort: { id: 1 },
  };

  if (moreOptions) options = Object.assign(options, moreOptions);

  const result = await Review.findAndCountAll(options);

  if (!result || !result.reviews || !result.reviews[0]) return res.status(404).json('No reviews found.');

  const pages = Math.ceil(reviews.count / limit);
  // offset = limit * (page - 1);
  const reviews = result.rows;
  res.status(200).json({ reviews, 'count': result.count, pages });
}

module.exports = router;