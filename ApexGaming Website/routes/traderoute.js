const express = require('express');
const router = express.Router();
const controller = require('../controllers/tradeController');
const {authenticated, isCreatedBy,isOfferedBy} = require('../middlewares/auth');
const {validateId, validateTrade, validateResult} = require('../middlewares/validator'); 
//get /items: gives all items
router.get('/', controller.index);

//get items/new : sends a form to create a new item (join us!)
router.get('/new',authenticated, controller.new);

//post /items: creates a new item
router.post('/', authenticated,validateTrade ,controller.create);

//get /items:id : gives an item with that particular id
router.get('/:id',validateId, controller.show);

//get /items/:id/edit sends a form to edit the item of that particular id
router.get('/:id/edit',validateId, authenticated, isCreatedBy, controller.edit);

//put /items/:id updates the particular item of that id
router.put('/:id', validateId, authenticated,validateTrade, isCreatedBy, controller.update);

//delete /items/:id : deletes the particular item of that id
router.delete('/:id',validateId, authenticated,validateTrade, isCreatedBy, controller.delete);

//------
router.post('/:id', validateId, controller.cart);

//POST /items/:id/Watch: Watch the connection with given ID
router.post('/:id/WATCH',validateId,authenticated,validateResult,controller.watch);

//DELETE /items/:id/Watch: Delete the RSVP for the connection with given ID
router.delete('/:id/unwatch',validateId,authenticated,controller.watchDelete);


router.post('/:id/trade',validateId,authenticated, controller.trade);

router.post("/:id/tradeitem", controller.tradeitem);

router.get("/:id/manage",validateId, controller.manage);

router.get("/:id/accept",validateId, controller.accept);

router.get("/:id/reject", validateId, controller.reject);

router.delete("/:id/offer", validateId, controller.offerdelete);


module.exports = router;