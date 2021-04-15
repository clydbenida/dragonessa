const JOI = require("joi")

module.exports.productSchema = JOI.object({
  name: JOI.string().required().max(256),
  qty: JOI.number().required().min(0),
  price: JOI.number().required().min(0)
}).required()