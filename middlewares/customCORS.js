export const customCors = (req, res, next) => {
    let allowedOrigins = ["https://www.behnid.com", "https://behnid.com"]
    let origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin); // restrict it to the required domain
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range')
    res.setHeader('Content-Range', 'posts 0-24/319')
    next();
}