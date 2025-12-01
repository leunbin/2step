const { adminService } = require("../service");
const utils = require("../misc/utils");

const adminController = {
  async putOrder(req, res,next){
    try{
      const id = Number(req.params.orderId);
      const data = req.body;
      console.log(id)
      const result = await adminService.updateOrder(id, data);

      res.status(200).json(utils.buildResponse(result));
    } catch(e) {
      next(e)
    }
  },

  async deleteOrder(req, res, next){
    try{
      const id = Number(req.params.orderId);
      const result = await adminService.deleteOrder(id);

      res.status(200).json(utils.buildResponse(result));
    } catch(e) {
      next(e)
    }
  }
}

module.exports = adminController;