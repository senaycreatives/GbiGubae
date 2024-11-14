const mongoose = require("mongoose");
/**
 * @swagger
 * components:
 *   schemas:
 *     Gbigubae:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         place:
 *           type: string
 *         creations:
 *           type: string
 *           format: date-time
 */

const GbigubaeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  creations: {
    type: Date,
    default: Date.now,
  },
});

const Gbigubae = mongoose.model("Gbigubae", GbigubaeSchema);

module.exports = Gbigubae;
