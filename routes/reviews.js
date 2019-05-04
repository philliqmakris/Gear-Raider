const auth = require('../middleware/auth');
const { User, Review } = require("../models");
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  // GET ONLY PRODUCT NAME?
  const reviews = await Review.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      {
        model: User,
        through: {
          attributes: ['username', 'id'],
        }
      },
    ],
  });
 
  if (!reviews || !reviews[0]) return res.status(404).json('No reviews found.');
  
  res.status(200).json(reviews);
  console.log('review list sent')
});

router.get('/:id', auth, async (req, res) => {
  console.log('reviews get by id')
});

router.post('/', auth, async (req, res) => {

  // user ID comes off the token
  const userId = req.user.id;
  const review = await Review.create(req.body.review);

  res.status(200).json(review);
  console.log('review created');
});

router.put('/:id', auth, async (req, res) => {
  console.log('reviews put')
});

router.delete('/:id', auth, async (req, res) => {
  console.log('reviews delete')
});

module.exports = router;