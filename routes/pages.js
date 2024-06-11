const express=require("express");
const router=express.Router();

router.get("/",(req,res)=>{
    res.render("login"); 
});
router.get('/registration', (req, res) => {
    res.render('registration'); 
  });
router.get("/index",(req,res)=>{
    res.render("index");
});
router.get("/sidebar",(req,res)=>{ 
    res.render("sidebar");
});
router.get("/navbar",(req,res)=>{
  res.render("navbar");
});
router.get("/city",(req,res)=>{
  res.render("city");
});
router.get("/state",(req,res)=>{
  res.render("state");
});
router.get("/color",(req,res)=>{
    res.render("color");
});
router.get('/company', (req, res) => {
    res.render('company'); 
  });
   router.get('/accountconfiguration', (req, res) => {
    res.render('accountconfiguration'); 
  });
  router.get('/user', (req, res) => {
    res.render('user'); 
  });
  router.get('/customer', (req, res) => {
    res.render('customer'); 
  });
  router.post("/customer",(req,res)=>{
    res.render("customeradd");
});
router.put("/customer", (req, res) => {
    res.render("customeredit", { id: req.params.id });
});
router.get("/customer", (req, res) => {
    res.render("customerdelete", { id: req.params.id });
});
router.get('/manufacturer', (req, res) => {
  res.render('manufacturer'); 
});
router.post("/manufacturer",(req,res)=>{
  res.render("manufactureradd");
});
router.put("/manufacturer", (req, res) => {
  res.render("manufactureredit", { id: req.params.id });
});
router.get("/manufacturer", (req, res) => {
  res.render("manufacturerdelete", { id: req.params.id });
});
router.get('/customerdisc', (req, res) => {
  res.render('customerdisc'); 
});
router.post("/customerdisc",(req,res)=>{
  res.render("customerdiscadd");
});
router.put("/customerdisc", (req, res) => {
  res.render("customerdiscedit", { id: req.params.id });
});
router.get("/customerdisc", (req, res) => {
  res.render("customerdiscdelete", { id: req.params.id });
});
router.get('/product', (req, res) => {
  res.render('product'); 
});
router.get('/product', (req, res) => {
  res.render('getproduct'); 
});
router.post("/product",(req,res)=>{
  res.render("productadd");
});
router.put("/product", (req, res) => {
  res.render("productedit", { id: req.params.id });
});
router.get("/product", (req, res) => {
  res.render("productdelete", { id: req.params.id });
});
router.get('/producttype', (req, res) => {
  res.render('producttype'); 
});
router.post("/producttype",(req,res)=>{
  res.render("producttypeadd");
});
router.put("/producttype", (req, res) => {
  res.render("producttypeedit", { id: req.params.id });
});
router.get("/producttype", (req, res) => {
  res.render("producttypedelete", { id: req.params.id });
});
router.get('/producttype/type', (req, res) => {
  res.render('gettype'); 
});
router.get('/productcategory/category', (req, res) => {
  res.render('getcategory'); 
});
router.get('/uom/getuom', (req, res) => {
  res.render('getuom'); 
});
router.get('/productcategory', (req, res) => {
  res.render('productcategory'); 
});
router.post("/productcategory",(req,res)=>{
  res.render("productcategory");
});
router.put("/productcategory", (req, res) => {
  res.render("productcategoryedit", { id: req.params.id });
});
router.get("/productcategory", (req, res) => {
  res.render("productcategorydelete", { id: req.params.id });
});
router.get('/uom', (req, res) => {
  res.render('uom'); 
});
router.post("/uom",(req,res)=>{
  res.render("uom");
});
router.put("/uom", (req, res) => {
  res.render("uomedit", { id: req.params.id });
});
router.get("/uom", (req, res) => {
  res.render("uomdelete", { id: req.params.id });
});
router.get('/stockob', (req, res) => {
  res.render('stockob'); 
});
router.post("/stockob",(req,res)=>{
  res.render("stockob");
});
router.put("/stockob", (req, res) => {
  res.render("stockobedit", { id: req.params.id });
});
router.get("/stockob", (req, res) => {
  res.render("stockobdelete", { id: req.params.id });
});
router.get('/salesman', (req, res) => {
  res.render('salesman'); 
});
router.post("/salesman",(req,res)=>{
  res.render("salesman");
});
router.put("/salesman", (req, res) => {
  res.render("salesmanedit", { id: req.params.id });
});
router.get("/salesman", (req, res) => {
  res.render("salesmandelete", { id: req.params.id });
});
router.get('/supplier', (req, res) => {
  res.render('supplier'); 
});
router.post("/supplier",(req,res)=>{
  res.render("supplier");
});
router.put("/supplier", (req, res) => {
  res.render("supplieredit", { id: req.params.id });
});
router.get("/supplier", (req, res) => {
  res.render("supplierdelete", { id: req.params.id });
});
router.get('/ledger', (req, res) => {
  res.render('ledger'); 
});
router.post("/ledger",(req,res)=>{
  res.render("ledger");
});
router.put("/ledger", (req, res) => {
  res.render("ledgeredit", { id: req.params.id });
});
router.get("/ledger", (req, res) => {
  res.render("ledgerdelete", { id: req.params.id });
});
router.get('/subgroup', (req, res) => {
  res.render('subgroup'); 
});
router.post("/subgroup",(req,res)=>{
  res.render("subgroup");
});
router.put("/subgroup", (req, res) => {
  res.render("subgroupedit", { id: req.params.id });
});
router.get("/subgroup", (req, res) => {
  res.render("subgroupdelete", { id: req.params.id });
});
router.get('/purchaseregister', (req, res) => {
  res.render('purchaseregister'); 
}); 
router.post("/purchaseregister",(req,res)=>{
  res.render("purchaseregister");
});
router.put("/purchaseregister", (req, res) => {
  res.render("purchaseregisteredit", { id: req.params.id });
});
router.get("/purchaseregister", (req, res) => {
  res.render("purchaseregisterdelete", { id: req.params.id });
});
router.get('/purchase', (req, res) => {
  res.render('purchase'); 
});
router.post("/purchase",(req,res)=>{
  res.render("purchase");
});
router.put("/purchase", (req, res) => {
  res.render("purchaseedit", { id: req.params.id });
});
router.get("/purchase", (req, res) => {
  res.render("purchasedelete", { id: req.params.id });
});
router.get('/multireceipt', (req, res) => {
  res.render('multireceipt');
});
router.post("/multireceipt",(req,res)=>{
  res.render("multireceipt");
});
router.put("/multireceipt", (req, res) => {
  res.render("multireceiptedit", { id: req.params.id });
});
router.get("/multireceipt", (req, res) => {
  res.render("multireceiptdelete", { id: req.params.id });
});
router.get('/multireceipt/dr', (req, res) => {
  res.render('getDr'); 
});

router.get('/multireceipt/cr', (req, res) => {
  res.render('getCr'); 
});
router.get('/multipayment', (req, res) => {
  res.render('multipayment'); 
});
router.post("/multipayment",(req,res)=>{
  res.render("multipayment");
});
router.put("/multipayment", (req, res) => {
  res.render("multipaymentedit", { id: req.params.id });
});
router.get("/multipayment", (req, res) => {
  res.render("multipaymentdelete", { id: req.params.id });
});
router.get('/multipayment/dr', (req, res) => {
  res.render('getPaymentDr'); 
});

router.get('/multipayment/cr', (req, res) => {
  res.render('getPaymentCr'); 
});
router.get('/receipt', (req, res) => {
  res.render('receipt'); 
});
router.post("/receipt",(req,res)=>{
  res.render("receipt");
});
router.put("/receipt", (req, res) => {
  res.render("receiptedit", { id: req.params.id });
});
router.get("/receipt", (req, res) => {
  res.render("receiptdelete", { id: req.params.id });
});
router.get('/recipt/dr', (req, res) => {
  res.render('receiptDr'); 
});

router.get('/recipt/cr', (req, res) => {
  res.render('receiptCr'); 
});
router.get('/payment', (req, res) => {
  res.render('payment'); 
});
router.post("/payment",(req,res)=>{
  res.render("payment");
});
router.put("/payment", (req, res) => {
  res.render("paymentedit", { id: req.params.id });
});
router.get("/payment", (req, res) => {
  res.render("paymentdelete", { id: req.params.id });
});
router.get('/payment/dr', (req, res) => {
  res.render('paymentDr'); 
});

router.get('/payment/cr', (req, res) => {
  res.render('paymentCr'); 
});
router.get('/ledgerob', (req, res) => {
  res.render('ledgerob');
});
router.get('/ledgerob', (req, res) => {
  res.render('ledgerData');
});

router.get('/journal', (req, res) => {
  res.render('journal'); 
});
router.post("/journal",(req,res)=>{
  res.render("journal");
});
router.put("/journal", (req, res) => {
  res.render("journaledit", { id: req.params.id });
});
router.get("/journal", (req, res) => {
  res.render("journaldelete", { id: req.params.id });
});
router.get('/journal/particulars', (req, res) => {
  res.render('journalparticulars'); 
});
router.get('/creditnote', (req, res) => {
  res.render('creditnote'); 
});
router.post("/creditnote",(req,res)=>{
  res.render("creditnote");
});
router.put("/creditnote", (req, res) => {
  res.render("creditnoteedit", { id: req.params.id });
});
router.get("/creditnote", (req, res) => {
  res.render("creditnotedelete", { id: req.params.id });
});
router.get('/creditnote/particulars', (req, res) => {
  res.render('creditnoteparticulars'); 
});
router.get('/contra', (req, res) => {
  res.render('contra'); 
});
router.post("/contra",(req,res)=>{
  res.render("contra");
});
router.put("/contra", (req, res) => {
  res.render("contraedit", { id: req.params.id });
});
router.get("/contra", (req, res) => {
  res.render("contradelete", { id: req.params.id });
});
router.get('/contra/dr', (req, res) => {
  res.render('contraDr'); 
});

router.get('/contra/cr', (req, res) => {
  res.render('contraCr'); 
});
router.put('/color',(req,res)=>{
  res.render('color', { id: req.params.id });
});

module.exports=router;