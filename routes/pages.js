const express=require("express");
const { route } = require("./auth");
const router=express.Router();

router.get("/",(req,res)=>{
    res.render("login"); 
});
router.get("/logout",(req,res)=>{
  res.render("logout"); 
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


router.get('/Purchasereturnregister', (req, res) => {
  res.render('Purchasereturnregister'); 
}); 
router.post("/Purchasereturnregister",(req,res)=>{
  res.render("Purchasereturnregister");
});
router.put("/Purchasereturnregister", (req, res) => {
  res.render("Purchasereturnregisteredit", { id: req.params.id });
});
router.get("/Purchasereturnregister", (req, res) => {
  res.render("Purchasereturnregisterdelete", { id: req.params.id });
});
router.get('/purchasedraftregister', (req, res) => {
  res.render('purchasedraftregister'); 
}); 
router.post("/purchasedraftregister",(req,res)=>{
  res.render("purchasedraftregister");
});
router.put("/purchasedraftregister", (req, res) => {
  res.render("purchasedraftregisteredit", { id: req.params.id });
});
router.get("/purchasedraftregister", (req, res) => {
  res.render("purchasedraftregisterdelete", { id: req.params.id });
});
router.get('/purchase', (req, res) => {
  res.render('purchase'); 
});
router.post("/purchase", (req, res) => {
  res.render("purchaseadd");
});
router.put("/purchase", (req, res) => {
  res.render("purchaseEdit", { id: req.params.id });
});
router.get("/editPurchase", (req, res) => {
  res.render("editPurchase", { id: req.params.id });
});
router.get("/editPurchase/purchaseEdit", (req, res) => {
  res.render("purchaseEdit", { id: req.params.id });
});
router.get("/purchase", (req, res) => {
  res.render("purchasedelete", { id: req.params.id });
});
router.get("/purchase", (req, res) => {
  res.render("purchasetransdelete", { id: req.params.id });         
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
router.post('/purchase',(req,res)=>{
  res.render('purchaseadd');
});
router.post('/purchase',(req,res)=>{
  res.render('purchaseEdit');
});
router.get('/purchase',(req,res)=>{
  res.render('purchase');
});
router.get('/purchase/suppliername', (req, res) => {
  res.render('suppliername'); 
});
router.get('/purchase/productname',(req,res)=>{
  res.render('productname');
});
router.get('/purchase/selectedsupplier',(req,res)=>{
  res.render('selectedsupplier'); 
});
router.get('/purchase/PurchaseId',(req,res)=>{
  res.render('PurchaseId');
});
router.get('/purchase/productid',(req,res)=>{
  res.render('productid');
});
router.get('/Purchasereturn/PurchasereturnId',(req,res)=>{
  res.render('PurchasereturnId');
});
router.get('/Purchasereturn/productreturnid',(req,res)=>{
  res.render('productreturnid');
});
router.get('/purchase', (req, res) => {
  const viewName = req.query.view || 'purchase'; 
  res.render(viewName);
});
router.get('purchase/purchaseDetails',(req,res)=>{
res.render('purchaseDetails');
});
router.get('/city',(req,res)=>{
res.render('city')
})
router.get('/company/getcity',(req,res)=>{
  res.render('getcity')
})
router.get('/manufacturer/getcity',(req,res)=>{
  res.render('getcity')
})
router.get('/supplier/getcity',(req,res)=>{
  res.render('getcity')
})
router.get('/company/getcompany',(req,res)=>{
  res.render('getcompany')
})
router.get('/company/updatecompany',(req,res)=>{
  res.render('updatecompany')
})

router.get('/purchasereturn', (req, res) => {
  res.render('purchasereturn'); 
});
router.post("/purchasereturn", (req, res) => {
  res.render("purchasereturnadd");
});
router.put("/purchasereturn", (req, res) => {
  res.render("purchasereturnEdit", { id: req.params.id });
});
router.get("/editpurchasereturn", (req, res) => {
  res.render("editpurchasereturn", { id: req.params.id });
});
router.get("/editpurchasereturn/purchasereturnEdit", (req, res) => {
  res.render("purchasereturnEdit", { id: req.params.id });
});
router.get("/purchasereturn", (req, res) => {
  res.render("purchasereturndelete", { id: req.params.id });
});
router.get("/purchasereturn", (req, res) => {
  res.render("purchasereturntransdelete", { id: req.params.id });         
});

router.get('/sales', (req, res) => {
  res.render('sales'); 
});
router.post("/sales", (req, res) => {
  res.render("salesadd");
});
router.put("/sales", (req, res) => {
  res.render("salesEdit", { id: req.params.id });
});
router.get("/editsales", (req, res) => {
  res.render("editsales", { id: req.params.id });
});
router.get("/editsales/salesEdit", (req, res) => {
  res.render("salesEdit", { id: req.params.id });
});
router.get("/sales", (req, res) => {
  res.render("salesdelete", { id: req.params.id });
});
router.get("/sales", (req, res) => {
  res.render("salestransdelete", { id: req.params.id });         
});
router.get('/salesregister', (req, res) => {
  res.render('salesregister'); 
});
router.get('/sales', (req, res) => {
  res.render('batchDetails', { id:  req.body }); 
});
router.get('/salesReturn', (req, res) => {
  res.render('salesReturn'); 
});
router.post("/salesReturn", (req, res) => {
  res.render("salesReturnadd");
});
router.put("/salesReturn", (req, res) => {
  res.render("salesReturnEdit", { id: req.params.id });
});
router.get("/editsalesReturn", (req, res) => {
  res.render("editsalesReturn", { id: req.params.id });
});
router.get("/editsalesReturn/salesReturnEdit", (req, res) => {
  res.render("salesReturnEdit", { id: req.params.id });
});
router.get("/salesReturn", (req, res) => {
  res.render("salesReturndelete", { id: req.params.id });
});
router.get("/salesReturn", (req, res) => {
  res.render("salesReturntransdelete", { id: req.params.id });         
});
router.get('/salesReturnregister', (req, res) => {
  res.render('salesReturnregister'); 
});
router.get('/salesReturn', (req, res) => {
  res.render('batchDetails', { id:  req.body }); 
});
router.get('/header', (req, res) => {
  res.render('companyTitle'); 
});
router.get('/gstpurchase',(req,res) => {
  res.render('gstpurchase');
});
router.get('/gstsales',(req,res) => {
  res.render('gstsales');
});
router.get('/hsnpurchase',(req,res) => {
  res.render('hsnpurchase');
});
router.get('/hsnsales',(req,res) => { 
  res.render('hsnsales'); 
  });
router.get('/balancesheet',(req,res) => {
  res.render('balancesheet'); 
});
router.get('/profitandloss',(req,res)=>{
  res.render('profitandloss');
});
router.get('/trailbalance',(req,res)=>{
res.render('trailbalance');
});
router.get('/creditbook',(req,res)=>{
res.render('creditbook');
  });
  router.get('/journalbook',(req,res)=>{
    res.render('journalbook');
      });
router.get('/daybook',(req,res)=>{
  res.render('daybook');
});
router.get('/cashbook',(req,res)=>{
  res.render('cashbook');
});
router.get('/bankbook',(req,res)=>{
  res.render('bankbook');
});
router.get('/ledgerbook',(req,res)=>{
  res.render('ledgerbook');
});
router.get('/billwise',(req,res)=>{
  res.render('billwise');
});
router.get('/salesoutstanding',(req,res)=>{
  res.render('salesoutstanding');
});
router.get('/purchaseoutstanding',(req,res)=>{
  res.render('purchaseoutstanding');
});
router.get('/productwisepurcsale',(req,res)=>{
  res.render('productwisepurcsale');
});
router.get('/productwisepurcsale',(req,res)=>{
  res.render('productwisepurcsale');
});
router.get('/productwisepurcsale',(req,res)=>{
  res.render('productwisepurcsale');
});
router.get('/productwisepurcsale',(req,res)=>{
  res.render('productwisepurcsale');
});
router.get('/productwisepurcsale',(req,res)=>{
  res.render('productwisepurcsale');
});
router.get('/currentstock',(req,res)=>{
  res.render('currentstock');
});
router.get('/stocksummary',(req,res)=>{
  res.render('stocksummary');
}); 
router.get('/batchsummary',(req,res)=>{
  res.render('batchsummary');
});
router.get('/stockanalysis',(req,res)=>{
  res.render('stockanalysis');
});
router.get('/purchaseprintpage',(req,res)=>{
    res.render('purchaseprintpage');
});
router.get('/salesprintpage',(req,res)=>{
  res.render('salesprintpage');
});
router.get("/salesretailprint", (req, res) => {
  res.render("salesretailprint");
});
router.get('/menuaccesscontrol',(req,res)=>{
  res.render('menuaccesscontrol');  
});
router.get("/salesretail", (req, res) => {
  res.render("salesretail");
});
router.post("/salesretail", (req, res) => {
  res.render("salesretail");
});
router.put("/salesretail", (req, res) => {
  res.render("salesretailEdit", { id: req.params.id });
});
router.get("/editsalesretail", (req, res) => {
  res.render("editsalesretail", { id: req.params.id });
});
router.get("/editsalesretail/salesretailEdit", (req, res) => {
  res.render("salesretailEdit", { id: req.params.id });
});
router.get("/salesretail", (req, res) => {
  res.render("salesretaildelete", { id: req.params.id });
});
router.get("/salesretail", (req, res) => {
  res.render("salesretailtransdelete", { id: req.params.id });
});
router.get("/salesretailregister", (req, res) => {
  res.render("salesretailregister");
});
router.get("/salesretail", (req, res) => {
  res.render("batchDetails", { id: req.body });
});

router.get("/molecules", (req, res) => {
  res.render("molecules");
});
router.post("/molecules", (req, res) => {
  res.render("molecules");
});
router.put("/molecules", (req, res) => {
  res.render("moleculesedit", { id: req.params.id });
});
router.get("/molecules", (req, res) => {
  res.render("moleculesdelete", { id: req.params.id });
});
router.get("/combinedmolecules", (req, res) => {
  res.render("combinedmolecules");
});
router.post("/combinedmolecules", (req, res) => {
  res.render("combinedmolecules");
});
router.put("/combinedmolecules", (req, res) => {
  res.render("combinedmoleculesedit", { id: req.params.id });
});
router.get("/combinedmolecules", (req, res) => {
  res.render("combinedmoleculesdelete", { id: req.params.id });
});


router.get("/package", (req, res) => {
  res.render("package");
});
router.post("/package", (req, res) => {
  res.render("package");
});
router.put("/package", (req, res) => {
  res.render("packageedit", { id: req.params.id });
});
router.get("/package", (req, res) => {
  res.render("packagedelete", { id: req.params.id });
});


module.exports=router;     