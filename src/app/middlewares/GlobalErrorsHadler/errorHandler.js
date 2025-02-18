const globalErrorHandler = (err, req, res, next) => {

    console.error("errors = ", err); 
  
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  };
  
  export default globalErrorHandler;
  