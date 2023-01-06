export const customCors = (_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://behnid.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    next();
}