
const validatorMiddleware = (schema) => (req, res, next) => {
    
    
  const result = schema.safeParse(req.body);
console.dir(result, { depth: null });
   
  if (!result.success) {
    console.log(result.error.issues);

    return res.status(400).json({
      success: false,
      errors: result.error.issues,
    });
  }

  req.body = result.data;
  next();
};

module.exports = validatorMiddleware;