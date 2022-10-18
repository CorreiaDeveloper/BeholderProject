module.exports = (error, req, res, next) => {
    return res.status(500).json(error.response ? error.response.data : error.message)
}
