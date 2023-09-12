const router = require('express').Router()

const { ratePiece, getPieces } = require('../controllers/pieceController')

module.exports = router


router.route('/pieces').get(getPieces)
router.post('/pieces/:id/rate', ratePiece)
