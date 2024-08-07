const express = require("express");
const router = express.Router();
const userController = require('../controllers/user');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/company', userController.company);
router.post('/accountconfiguration', userController.accountconfiguration);
router.get('/user', userController.user);
router.get("/customer", userController.customer);
router.post("/customer", userController.customeradd);
router.put("/customeredit/:id", userController.customeredit);
router.delete("/customerdelete/:id", userController.customerdelete);
router.get("/manufacturer", userController.manufacturer);
router.post("/manufacturer", userController.manufactureradd);
router.put("/manufactureredit/:id", userController.manufactureredit);
router.delete("/manufacturerdelete/:id", userController.manufacturerdelete);
router.get("/customerdisc", userController.customerdisc);
router.post("/customerdisc", userController.customerdiscadd);
router.put("/customerdiscedit/:id", userController.customerdiscedit);
router.delete("/customerdiscdelete/:id", userController.customerdiscdelete);
router.get("/product", userController.product);
router.get("/product/getproduct", userController.getproduct);
router.post("/product", userController.productadd);
router.put("/productedit/:id", userController.productedit);
router.delete("/productdelete/:id", userController.productdelete);
router.get("/producttype", userController.producttype);
router.get("/productcategory/category", userController.getcategory);
router.get("/uom/getuom", userController.getuom);
router.get("/producttype/type", userController.gettype);
router.post("/producttype", userController.producttypeadd);    
router.put("/producttypeedit/:id", userController.producttypeedit);
router.delete("/producttypedelete/:id", userController.producttypedelete);
router.get("/productcategory", userController.productcategory);
router.post("/productcategory", userController.productcategoryadd);
router.put("/productcategoryedit/:id", userController.productcategoryedit);
router.delete("/productcategorydelete/:id", userController.productcategorydelete);
router.get("/uom", userController.uom);
router.post("/uom", userController.uomadd);
router.put("/uomedit/:id", userController.uomedit);
router.delete("/uomdelete/:id", userController.uomdelete);
router.get("/stockob", userController.stockob);
router.post("/stockob", userController.stockobadd);
router.put("/stockobedit/:id", userController.stockobedit);
router.delete("/stockobdelete/:id", userController.stockobdelete);
router.get("/salesman", userController.salesman);
router.post("/salesman", userController.salesmanadd);
router.put("/salesmanedit/:id", userController.salesmanedit);
router.delete("/salesmandelete/:id", userController.salesmandelete);
router.get("/supplier", userController.supplier);
router.post("/supplier", userController.supplieradd);
router.put("/supplieredit/:id", userController.supplieredit);
router.delete("/supplierdelete/:id", userController.supplierdelete);
router.get("/ledger", userController.ledger);
router.post("/ledger", userController.ledgeradd);
router.put("/ledgeredit/:id", userController.ledgeredit);
router.delete("/ledgerdelete/:id", userController.ledgerdelete);
router.get("/subgroup", userController.subgroup);
router.post("/subgroup", userController.subgroupadd);
router.put("/subgroupedit/:id", userController.subgroupedit);
router.delete("/subgroupdelete/:id", userController.subgroupdelete);
router.get("/multireceiptselect/:id", userController.multireceiptselect);
router.get("/multipaymentselect/:id", userController.multipaymentselect);
router.get("/multireceipt", userController.multireceipt);
router.post("/multireceipt", userController.multireceiptadd);
router.put("/multireceiptedit/:id", userController.multireceiptedit);
router.delete("/multireceiptdelete/:id", userController.multireceiptdelete);
router.delete("/multireceipttransdelete/:transId", userController.multireceipttransdelete);
router.delete("/multipaymenttransdelete/:transId", userController.multipaymenttransdelete);
router.get("/multireceipt/dr", userController.getDr);
router.get("/multireceipt/cr", userController.getCr);
router.get("/multipayment", userController.multipayment);
router.post("/multipayment", userController.multipaymentadd);
router.put("/multipaymentedit/:id", userController.multipaymentedit);
router.delete("/multipaymentdelete/:id", userController.multipaymentdelete);
router.get("/multipayment/dr", userController.getPaymentDr);
router.get("/multipayment/cr", userController.getPaymentCr);
router.get("/receipt", userController.receipt);
router.post("/receipt", userController.receiptadd);
router.put("/receiptedit/:id", userController.receiptedit);
router.delete("/receiptdelete/:id", userController.receiptdelete);
router.get("/recipt/dr", userController.receiptDr);
router.get("/recipt/cr", userController.receiptCr);
router.get("/payment", userController.payment);
router.post("/payment", userController.paymentadd);
router.put("/paymentedit/:id", userController.paymentedit);
router.delete("/paymentdelete/:id", userController.paymentdelete);
router.get("/payment/dr", userController.paymentDr);
router.get("/payment/cr", userController.paymentCr);
router.get("/ledgerob", userController.ledgerob);
router.get("/ledgerData", userController.ledgerData);
router.get("/journal", userController.journal);
router.post("/journal", userController.journaladd);
router.put("/journaledit/:id", userController.journaledit);
router.delete("/journaldelete/:id", userController.journaldelete);
router.get("/journal/particulars", userController.journalparticulars);
router.get("/creditnote", userController.creditnote);
router.post("/creditnote", userController.creditnoteadd);
router.put("/creditnoteedit/:id", userController.creditnoteedit);  
router.delete("/creditnotedelete/:id", userController.creditnotedelete);
router.get("/creditnote/particulars", userController.creditnoteparticulars);
router.get("/contra", userController.contra);
router.post("/contra", userController.contraadd);
router.put("/contraedit/:id", userController.contraedit);
router.delete("/contradelete/:id", userController.contradelete);
router.get("/contra/dr", userController.contraDr);
router.get("/contra/cr", userController.contraCr);
router.put('/color/:id', userController.color);
router.post('/purchase',userController.purchaseadd);
router.get("/purchase/suppliername", userController.suppliername);
router.get("/purchase",userController.purchase);
router.get("/purchase/productname",userController.productname);
router.get("/purchase/selectedsupplier",userController.getDataBySupplier);
router.get("/purchaseregister",userController.purchaseregister);
router.get("/purchasedraftregister",userController.purchasedraftregister);
router.put("/purchaseEdit/:id", userController.purchaseEdit);  
router.delete("/purchasedelete/:id", userController.purchasedelete);
router.delete("/purchasetransdelete/:id", userController.purchasetransdelete);
router.get("/purchase/PurchaseId",userController.PurchaseId);
router.get('/purchase/purchaseids', userController.purchaseids);
router.get('/purchase/purchaseDetails', userController.purchaseDetails);
router.get('/city',userController.city);
router.get('/purchase/productid',userController.productid);
router.get('/purchase/companystate',userController.companystate);
router.get('/company/getcity',userController.getcity);
router.get('/purchase/supplierstate',userController.supplierstate);
router.get('/purchase/discmode',userController.discmode);
router.get('/manufacturer/getcity',userController.getcity);
router.get('/customer/getcity',userController.getcity);
router.get('/salesman/getcity',userController.getcity);
router.get('/supplier/getcity',userController.getcity);
router.get('/company/getcompany',userController.getcompany);
router.put('/company/updatecompany',userController.updatecompany);
router.get("/editPurchase/productname",userController.productname);
router.get('/editPurchase/discmode',userController.discmode);
router.put("/editPurchase/purchaseEdit/:purchaseId", userController.purchaseEdit);

router.get('/Purchasereturn/PurchasereturnDetails', userController.PurchasereturnDetails);
router.post('/Purchasereturn',userController.Purchasereturnadd);
router.put("/PurchasereturnEdit/:id", userController.PurchasereturnEdit); 
router.get('/Purchasereturn/Purchasereturnids', userController.Purchasereturnids);
router.delete("/Purchasereturndelete/:id", userController.Purchasereturndelete);
router.delete("/Purchasereturntransdelete/:id", userController.Purchasereturntransdelete);
router.get("/Purchasereturn/PurchasereturnId",userController.PurchasereturnId);
router.get('/Purchasereturn/Purchasereturnids', userController.Purchasereturnids);
router.get('/Purchasereturn/productreturnid',userController.productreturnid);
router.get("/Purchasereturnregister",userController.Purchasereturnregister);

router.get('/sales/salesDetails', userController.salesDetails);
router.post('/sales',userController.salesadd);
router.put("/salesEdit/:id", userController.salesEdit); 
router.get('/sales/salesids', userController.salesids);     
router.delete("/salesdelete/:id", userController.salesdelete);
router.delete("/salestransdelete/:id", userController.salestransdelete);
router.get('/sales/saleproductid',userController.saleproductid);
router.get("/salesregister",userController.salesregister);
router.get("/sales/customername",userController.customername);
router.post('/sales/batchDetails/:selectedProductId', userController.batchDetails);

router.get('/salesReturn/salesReturnDetails', userController.salesReturnDetails);
router.post('/salesReturn',userController.salesReturnadd);
router.put("/salesReturnEdit/:id", userController.salesReturnEdit); 
router.get('/salesReturn/salesReturnids', userController.salesReturnids);
router.delete("/salesReturndelete/:id", userController.salesReturndelete);
router.delete("/salesReturntransdelete/:id", userController.salesReturntransdelete);
router.get('/salesReturn/salesReturnproductid',userController.salesReturnproductid);
router.get("/salesReturnregister",userController.salesReturnregister);
router.get("/salesReturn/customername",userController.customername);
router.post('/salesReturn/batchDetails/:selectedProductId', userController.batchDetails);

router.get('/sidebar/companyTitle', userController.companyTitle);

router.get('/index/supplierCount', userController.supplierCount);
router.get('/index/customerCount', userController.customerCount);
router.get('/index/productCount', userController.productCount);
router.get('/index/purchaseCount', userController.purchaseCount);
router.get('/index/salesData', userController.salesData);
router.get('/index/masterdata', userController.masterdata);

router.get('/gstpurchase', userController.gstPurchase);
router.get('/gstsales', userController.gstsales);
router.get('/hsnpurchase', userController.hsnPurchase);
router.get('/hsnsales', userController.hsnsales);      

router.get('/balancesheet', userController.balancesheet);
router.get('/profitandloss', userController.profitandloss);
router.get('/trailbalance', userController.trailbalance);
router.get('/creditbook', userController.creditbook);
router.get('/journalbook', userController.journalbook);
router.get('/daybook', userController.daybook);
router.get('/cashbook', userController.cashbook);
router.get('/bankbook', userController.bankbook);
router.get('/ledgerbook',userController.ledgerbook);
router.get('/ledgerbook/ledgerDr',userController.ledgerDr);
router.get('/billwise', userController.billwise);
router.get('/salesoutstanding', userController.salesoutstanding);
router.get('/purchaseoutstanding', userController.purchaseoutstanding);
router.get('/productwisepurcsale', userController.productwisepurcsale);
router.get('/currentstock', userController.currentstock);
router.get('/batchsummary', userController.batchsummary);
router.get('/stocksummary', userController.stocksummary);
router.get('/stockanalysis', userController.stockanalysis);

router.get('/purchaseprintpage/productdetails', userController.getProductDetails);
router.get('/purchaseprintpage/purchasedetails', userController.purchasedetails);

router.get('/purchaseoutstanding', userController.purchaseoutstanding);

router.get('/salesprintpage/productdetails', userController.getSalesProductDetails);
router.get('/salesprintpage/salesdetails', userController.salesdetails);

router.get('/salesretailprint/productdetails', userController.getSalesretailProductDetails);
router.get('/salesretailprint/salesdetails', userController.salesretaildetails);

router.get('/user/getrole', userController.getrole);
router.post('/user/create', userController.create);
router.post('/user/updateUser', userController.updateUser);
router.delete('/user/deleteUser/:id', userController.deleteUser);
router.get('/menuaccess', userController.menuaccess);
router.post('/menuaccess/updateCheckbox/:id', userController.updateCheckbox);

router.get('/sidebar', userController.sidebar);

router.get("/salesretail/salesretailDetails", userController.salesretailDetails);
router.post("/salesretail", userController.salesretailadd);
router.put("/salesretailEdit/:id", userController.salesretailEdit); 
router.get("/salesretail/salesretailids", userController.salesretailids);     
router.delete("/salesretaildelete/:id", userController.salesretaildelete);
router.delete( "/salesretailtransdelete/:id",userController.salesretailtransdelete);
router.get("/salesretail/salesretailproductid",userController.salesretailproductid);
router.get("/salesretailregister", userController.salesretailregister);
router.get("/salesretail/customername", userController.customername);
router.post("/salesretail/batchDetails/:selectedProductId",userController.batchDetails);

router.get("/molecules", userController.molecules);
router.post("/molecules", userController.moleculesadd);
router.put("/moleculesedit/:id", userController.moleculesedit);
router.delete("/moleculesdelete/:id", userController.moleculesdelete);

router.get("/combinedmolecules", userController.combinedmolecules);
router.post("/combinedmolecules", userController.combinedmoleculesadd);
router.put("/combinedmoleculesedit/:id", userController.combinedmoleculesedit);
router.delete(
  "/combinedmoleculesdelete/:id",
  userController.combinedmoleculesdelete
);

router.get(
  "/product/moleculescombination",
  userController.moleculescombination
);

router.get("/package", userController.package);
router.post("/package", userController.packageadd);
router.put("/packageedit/:id", userController.packageedit);
router.delete("/packagedelete/:id", userController.packagedelete);

module.exports = router;
