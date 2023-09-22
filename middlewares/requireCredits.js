module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  }

  if (req.user.credits < 1) {  
    return res.status(403).send({
      error: 'Not enough credits!',
      credits_required: 1,
      credits_available: 0
    });
  }

  next();
}