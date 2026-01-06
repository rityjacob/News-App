const invalidRoute = (req,res,next)=>{
    const error = new Error('Invalid Request');
    error.status = 404;
    next(error);
}

module.exports = invalidRoute;