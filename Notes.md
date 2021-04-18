Get Manager name Only
export function getAvailableManagers(req, res) {
var id = req.params.id;
var id = mongoose.Types.ObjectId(id);
User.find({ role: "Manager", restaurantID: id }, { locationName: 1 })
.then(user => {
return res.json(user);
})
.catch(err => res.json(err));
}

const id = req.params.productId;
Product.findById(id)
.exec()
.then(doc => {
console.log(doc);
res.status(200).json(doc);
})
.catch(err => {
console.log(err);
res.status(500).json({error: err})
});
