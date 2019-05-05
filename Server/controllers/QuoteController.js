const axios = require('axios')
let ax = axios.create({
    baseURL: "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json"
})

class QuoteController {
    static generateRandomQuote(req, res) {
        ax.get('')
            .then(({ data }) => {
                res.status(200).json(data)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }
}

module.exports = QuoteController