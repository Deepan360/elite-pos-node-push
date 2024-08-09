const sql = require('mssql');
const bcrypt = require("bcryptjs");

const jwt = require('jsonwebtoken');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});


const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    enableArithAbort: true,
  },
};

const pool = new sql.ConnectionPool(config);

const poolConnect = async () => {
  try {
    await pool.connect();
    console.log('Connected to the database '); 
    return pool;
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    throw error; // Make sure to rethrow the error to handle it in the calling function
  }
};

 function formatDate(dateString) {
//   // Implement your own date formatting logic here
   return dateString;   
 }   


//moleculescombination
exports.moleculescombination = async (req,res)=>{
  pool.connect((err, connection) => {
      if (err) {
          console.error('Error getting connection from pool:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      connection.query("EXEC Getmoleculescombination", (err, result) => {
        connection.release(); // Release the connection back to the pool

        if (err) {
          console.error("Error in listing data:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        // Send the data as JSON response
        res.json({ data: result.recordset });
      });
  });
}


//moleculescombination
//package

exports.packageadd = async (req, res) => {
  const { packagename } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
   
      .input('packagename', sql.VarChar(255), packagename || null)
      .execute('Addpackage');

    console.log(result);
    console.log(result.toString());

    // Redirect to another route after processing
    return res.redirect('/package');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

exports.packagedelete = async (req, res) => {
  const uomId = req.params.id;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('uomId', /* Assuming your parameter type is INT */ sql.Int, uomId)
      .execute('Deletepackage');

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "uomId deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "uomId not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.packageedit = async (req, res) => {
  const uomId = req.params.id;

  // Extract the product data from the request body
  const { packagename } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[package]
      SET
     
      packagename = ${packagename}
      WHERE
        id = ${uomId}
    `;

    console.log(result);
    console.log(result.toString());

    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "uomId Type updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., product ID not found)
      return res.status(404).json({ success: false, error: "uomId not found" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.package = (req, res) => {
  pool.connect((err, connection) => {
      if (err) {
          console.error('Error getting connection from pool:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      connection.query('EXEC Getpackage', (err, result) => {
          connection.release(); // Release the connection back to the pool

          if (err) {
              console.error('Error in listing data:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }

          // Send the data as JSON response
          res.json({ data: result.recordset });
      });
  });
};

//package

//combinemolecules

exports.combinedmoleculesadd = async (req, res) => {
  const {
    combinationcode, combinationname
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('combinationcode', sql.NVarChar(100), combinationcode || null)
      .input('combinationname', sql.NVarChar(50), combinationname || null)

      .execute('Addcombinedmolecules');

    console.log(result);
    console.log(result.toString());

    // Redirect to another route after processing
    return res.redirect('/combinedmolecules');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

exports.combinedmoleculesdelete = async (req, res) => {
  const uomId = req.params.id;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('uomId', /* Assuming your parameter type is INT */ sql.Int, uomId)
      .execute('Deletecombinedmolecules');

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "uomId deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "uomId not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.combinedmoleculesedit = async (req, res) => {
  const uomId = req.params.id;

  // Extract the product data from the request body
  const {
    combinationcode, combinationname
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[combinationmolecules]
      SET
      combinationcode = ${combinationcode},
      combinationname = ${combinationname}

      WHERE
        id = ${uomId}
    `;

    console.log(result);
    console.log(result.toString());

    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "uomId Type updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., product ID not found)
      return res.status(404).json({ success: false, error: "uomId not found" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.combinedmolecules = (req, res) => {
  pool.connect((err, connection) => {
      if (err) {
          console.error('Error getting connection from pool:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      connection.query('EXEC Getcombinedmolecules', (err, result) => {
          connection.release(); // Release the connection back to the pool

          if (err) {
              console.error('Error in listing data:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }

          // Send the data as JSON response
          res.json({ data: result.recordset });
      });
  });
};

//combinedmolecules



//molecules


exports.moleculesadd = async (req, res) => {
  const {
    moleculecode, moleculename
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('moleculecode', sql.NVarChar(100), moleculecode || null)
      .input('moleculename', sql.NVarChar(50), moleculename || null)
      .execute('Addmolecules');

    console.log(result);
    console.log(result.toString());

    // Redirect to another route after processing
    return res.redirect('/molecules');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};



exports.moleculesdelete = async (req, res) => {
  const uomId = req.params.id;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('uomId', /* Assuming your parameter type is INT */ sql.Int, uomId)
      .execute('DeleteMolecules');

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "uomId deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "uomId not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


exports.moleculesedit = async (req, res) => {
  const uomId = req.params.id;

  // Extract the product data from the request body
  const {
    moleculecode, moleculename
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[molecules]
      SET
      moleculecode = ${moleculecode},
      moleculename = ${moleculename}
      WHERE
        id = ${uomId}
    `;

    console.log(result);
    console.log(result.toString());

    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "uomId Type updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., product ID not found)
      return res.status(404).json({ success: false, error: "uomId not found" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.molecules = (req, res) => {
  pool.connect((err, connection) => {
      if (err) {
          console.error('Error getting connection from pool:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      connection.query('EXEC GetMolecules', (err, result) => {
          connection.release(); // Release the connection back to the pool

          if (err) {
              console.error('Error in listing data:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }

          // Send the data as JSON response
          res.json({ data: result.recordset });
      });
  });
};


//molecules
//salesretail retail

exports.salesretailDetails=async(req,res)=>{
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const query = 'SELECT * FROM [elite_pos].[dbo].[salesretail_Master]';

    pool.query(query, (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('Query Result:', result);

      res.json({ data: result.recordset });
    });
  });
};

exports.salesretailadd = async (req, res) => {
  console.log(req.body);
  const {
    saledate,
    paymentmode,
    customermobileno,
    customername,
    pamount,
    pigst,
    pcgst,
    psgst,
    psubtotal,
    pcess,
    ptcs,
    proundOff,
    pnetAmount,
    pdiscount,
    pdiscMode_,
    products: productsString,
  } = req.body;

  let parsedProducts = [];
  const formattedSaleDate = saledate ? saledate : null;

  try {
      await poolConnect();

      parsedProducts = JSON.parse(productsString);

      const result = await pool.query`
          INSERT INTO [elite_pos].[dbo].[salesretail_Master]
          ([saledate], [paymentmode],  [customermobileno], [customername], [amount], [cgst], [sgst], [igst], [netAmount], [cess], [tcs], [discMode], [discount], [subtotal], [roundoff])
          VALUES
          (${formattedSaleDate}, ${paymentmode},  ${customermobileno}, ${customername}, ${pamount}, ${pcgst}, ${psgst}, ${pigst}, ${pnetAmount}, ${pcess}, ${ptcs}, ${pdiscMode_}, ${pdiscount}, ${psubtotal}, ${proundOff});

          SELECT SCOPE_IDENTITY() as salesId;
      `;

      const salesId = result.recordset[0].salesId;
      console.log('Number of products:', parsedProducts.length);

      for (const product of parsedProducts) {
        const { productId, batchNo, tax, quantity, uom, purcRate,mrp, rate, discMode, discount, amount, cgst, sgst, igst, totalAmount } = product;

        await pool.query`
            INSERT INTO [elite_pos].[dbo].[salesretail_Trans]
            ([salesId], [product], [batchNo], [tax], [quantity], [uom],[purcRate], [mrp],[rate], [discMode], [discount], [amount], [cgst], [sgst], [igst], [totalAmount])
            VALUES
            (${salesId}, ${productId}, ${batchNo}, ${tax}, ${quantity}, ${uom},${purcRate},${mrp} ,${rate}, ${discMode}, ${discount}, ${amount}, ${cgst}, ${sgst}, ${igst}, ${totalAmount});
        `;

        await reduceStock(productId, quantity, batchNo); 
    }
    

      res.status(200).json({ success: true, message: 'salesretail added successfully' });
  } catch (error) {
      console.error('Error during salesretail processing:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.salesretailEdit = async (req, res) => {
  const { purchaseId } = req.params;
  const { purchaseDetails, products } = req.body;
  try {
    console.log('Received request to edit purchase:', req.body); 
    await pool.query`
        UPDATE [elite_pos].[dbo].[salesretail_Master]
        SET
            [saledate] = ${purchaseDetails.saledate},
            [paymentmode] = ${purchaseDetails.paymentmode},
            [customermobileno] = ${purchaseDetails.customermobileno},
            [customername] = ${purchaseDetails.customername},
            [amount] = ${purchaseDetails.pamount},
            [cgst] = ${purchaseDetails.pcgst},
            [sgst] = ${purchaseDetails.psgst},
            [igst] = ${purchaseDetails.pigst},
            [netAmount] = ${purchaseDetails.pnetAmount},
            [cess] = ${purchaseDetails.pcess},
            [tcs] = ${purchaseDetails.ptcs},
            [discMode] = ${purchaseDetails.pdiscMode_},
            [discount] = ${purchaseDetails.pdiscount},
            [subtotal] = ${purchaseDetails.psubtotal},
            [roundoff] = ${purchaseDetails.proundOff}
        WHERE
            [id] = ${purchaseDetails.id};
    `;
    for (const product of products) {
      const { Id, productId, batchNo, tax, quantity, uom,purcRate,mrp ,rate, discMode, discount, amount, cgst, sgst, igst, totalAmount } = product;
      if (Id) {
        await pool.query`
          UPDATE [elite_pos].[dbo].[salesretail_Trans]
          SET
              [product] = ${productId},
              [batchNo] = ${batchNo},
              [tax] = ${tax},
              [quantity] = ${quantity},
              [uom] = ${uom},
              [purcRate]=${purcRate},
               [mrp]=${mrp},
              [rate] = ${rate},
              [discMode] = ${discMode},
              [discount] = ${discount},
              [amount] = ${amount},
              [cgst] = ${cgst},
              [sgst] = ${sgst},
              [igst] = ${igst},
              [totalAmount] = ${totalAmount}
          WHERE
              [Id] = ${Id};
        `; 
      } else {
        await pool.query`
          INSERT INTO [elite_pos].[dbo].[salesretail_Trans] ([salesId], [product], [batchNo], [tax], [quantity], [uom],[purcRate],[mrp], [rate], [discMode], [discount], [amount], [cgst], [sgst], [igst], [totalAmount])
          VALUES ( ${purchaseDetails.id}, ${productId}, ${batchNo}, ${tax}, ${quantity}, ${uom},${purcRate},${mrp} ,${rate}, ${discMode}, ${discount}, ${amount}, ${cgst}, ${sgst}, ${igst}, ${totalAmount});
        `
         await reduceStock(productId, quantity,batchNo);
        ;
      }
    }
    console.log('salesretail edited successfully'); 
    res.status(200).json({ success: true, message: 'salesretail edited successfully' });
  } catch (error) {
    console.error('Error updating salesretail:', error);
    res.status(400).json({ success: false, message: 'Failed to update salesretail' });
  }
};

// async function reduceStock(productId, quantity,batchNo) {
//   try {
//     await pool.query`
//         UPDATE [elite_pos].[dbo].[stock_Ob] 
//         SET [op_quantity] = [op_quantity] - ${quantity} 
//         WHERE [Product] = ${productId} AND [batchNo]=${batchNo};
//     `;
//   } catch (error) {
//     console.error('Error reducing stock:', error);
//     throw error;
//   }
// };

exports.salesretailids = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const query = `
                  SELECT *
                 
              FROM 
                  [elite_pos].[dbo].[salesretail_Master] 
              
              `;
    pool.query(query, (err, result) => {
      connection.release();
      if (err) {
        console.error('Error in fetching purchase IDs:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.header('Content-Type', 'application/json'); 
      res.json({ data: result.recordset });
    });
  });
};

exports.salesretailproductid = (req, res) => {
  const purchaseId = req.query.purchaseId;
  pool.connect((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const query = `
    SELECT 
    pt.Id,
    pt.product, -- Assuming this is the product ID
    p.productname,
    dm.discMode,
    pt.batchNo,
    pt.tax,
    pt.quantity,
    pt.uom,
    pt.purcRate,
     pt.mrp,
    pt.rate,
    pt.discount,
    pt.amount,
    pt.cgst,
    pt.sgst,
    pt.igst,
    pt.totalAmount
FROM 
    [elite_pos].[dbo].[salesretail_Trans] pt
JOIN
    [elite_pos].[dbo].[product] p ON pt.product = p.id
JOIN
    [elite_pos].[dbo].[discmode] dm ON pt.discMode = dm.id
WHERE 
    pt.salesId = '${purchaseId}';
`;

    pool.query(query, (err, result) => {
      connection.release(); 

      if (err) {
        console.error("Error in listing data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      console.log("Query Result:", result);

      res.json({
        data: result.recordset.map((row) => ({
          ...row,
          product: row.productname,
        })),
      });
    });
  });
};

exports.salesretaildelete = async (req, res) => {
  const salesId = req.params.id; 
  
  try {
    await poolConnect();

    if (!salesId) {
      throw new Error('No salesId provided');
    }

    // Fetch transaction details associated with the salesId
    const transDetailsResult = await pool.query`
    SELECT Id, product, batchNo, quantity, tax, uom, rate
      FROM [elite_pos].[dbo].[salesretail_Trans]
      WHERE [salesId] = ${salesId};
    `;

    const transactions = transDetailsResult.recordset;

    // Iterate through each transaction
    for (const transaction of transactions) {
      const { Id: transactionId, product, batchNo, quantity, tax, uom, rate } = transaction;

      // Check if the transaction exists in the stock_Ob table based on product and batch number
      const stockResult = await pool.query`
        SELECT Id FROM [elite_pos].[dbo].[stock_Ob] 
        WHERE [product] = ${product} AND [batchNo] = ${batchNo};
      `;

      if (stockResult.recordset.length > 0) {
        // If the transaction exists, update the op_quantity column
        await pool.query`
          UPDATE [elite_pos].[dbo].[stock_Ob] 
          SET op_quantity = op_quantity + ${quantity} 
          WHERE [product] = ${product} AND [batchNo] = ${batchNo};
        `;
      } else {
        // If the transaction doesn't exist, insert a new record
        await pool.query`
          INSERT INTO [elite_pos].[dbo].[stock_Ob] (Id,product, batchNo, quantity, tax, uom, rate, op_quantity)
          VALUES ( ${transactionId},${product}, ${batchNo}, ${quantity}, ${tax}, ${uom}, ${rate}, ${quantity});
        `;
      }
    }

    // Delete from sales_Master
    await pool.query`
      DELETE FROM [elite_pos].[dbo].[salesretail_Master]
      WHERE [id] = ${salesId};
    `;
    
    // Delete associated products from sales_Trans
    await pool.query`
      DELETE FROM [elite_pos].[dbo].[salesretail_Trans]
      WHERE [salesId] = ${salesId};
    `;

    res.status(200).json({ success: true, message: 'salesretail and associated products deleted successfully' });
  } catch (error) {
    console.error('Error during salesretail deletion:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.salesretailtransdelete = async (req, res) => {
  const manufacturerId = req.params.id;
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const { recordset } = await pool.request()
      .input('manufacturerId', sql.Int, manufacturerId)
      .query('SELECT quantity, Product, batchNo, uom, rate, tax FROM [elite_pos].[dbo].[salesretail_Trans] WHERE Id = @manufacturerId');

    // Check if a record was found
    if (recordset.length === 0) {
      return res.status(404).json({ success: false, error: "Purchased product not found" });
    }

    // Extract the quantity, productId, batchNo, uom, rate, and tax values from the recordset
    const { quantity, Product: productId, batchNo ,uom, rate, tax } = recordset[0];

    // Log the quantity to inspect its value
    console.log('Quantity:', quantity);

    // Delete the salesretail transaction
    const result = await pool.request()
      .input('manufacturerId', sql.Int, manufacturerId)
      .query('DELETE FROM [elite_pos].[dbo].[salesretail_Trans] WHERE Id = @manufacturerId');

    // Update the stock in the stock_Ob table based on the productId, batchNo, and retrieved quantity
    await increaseStock(productId, batchNo, quantity, uom, rate, tax);

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Purchased product deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "Purchased product not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.salesretailregister = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query(`
    SELECT *
    FROM [elite_pos].[dbo].[salesretail_Master] 
    
   ;
    `, (err, result) => {
      connection.release(); 
      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};
 //salesretail



 
//menu access/user
exports.updateCheckbox = async (req, res) => {
  try {
      const { id, Accountant, Admin, Manager, Purchase, Sales, SuperAdmin, User } = req.body;

      // Call the stored procedure
      await updateCheckboxData(id, Accountant, Admin, Manager, Purchase, Sales, SuperAdmin, User);

      res.status(200).send('Checkbox data updated successfully');
  } catch (error) {
      console.error('Error updating checkbox data:', error.message);
      res.status(500).send('Internal server error');
  }
};

// Function to call the stored procedure to update checkbox data
async function updateCheckboxData(id, Accountant, Admin, Manager, Purchase, Sales, SuperAdmin, User) {
  try {
      const poolRequest = pool.request()
          .input('id', sql.Int, id)
          .input('Accountant', sql.Bit, Accountant)
          .input('Admin', sql.Bit, Admin)
          .input('Manager', sql.Bit, Manager)
          .input('Purchase', sql.Bit, Purchase)
          .input('Sales', sql.Bit, Sales)
          .input('SuperAdmin', sql.Bit, SuperAdmin)
          .input('User', sql.Bit, User);

      await poolRequest.execute('dbo.UpdateCheckboxData');
      console.log('Checkbox data updated successfully');
  } catch (error) {
      console.error('Error updating checkbox data in database:', error.message);
      throw error;
  }
}

// Function to update database with checkbox data
async function updateDatabase(data) {
  try {
    console.log('Data received:', data);

    const query = `
      UPDATE menu_access_rights
      SET 
        Accountant = @Accountant,
        Admin = @Admin,
        Manager = @Manager,
        Purchase = @Purchase,
        Sales = @Sales,
        SuperAdmin = @SuperAdmin,
        [User] = @User
      WHERE id = @id;
    `;

    const poolRequest = pool.request()
      .input('Accountant', data.Accountant)
      .input('Admin', data.Admin)
      .input('Manager', data.Manager)
      .input('Purchase', data.Purchase)
      .input('Sales', data.Sales)
      .input('SuperAdmin', data.SuperAdmin)
      .input('User', data.User)
      .input('id', data.id);

    await poolRequest.query(query);

    console.log('Checkbox data updated successfully');
  } catch (error) {
    console.error('Error updating database:', error.message);
    throw error;
  }
}


exports.getrole = (req, res) => {
  pool.connect((err, connection) => {
      if (err) {
          console.error('Error getting connection from pool:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }
      
      // Call the stored procedure
      const request = new sql.Request(connection);
      request.execute('dbo.GetRoles', (err, result) => {
          connection.release(); // Release the connection back to the pool

          if (err) {
              console.error('Error executing stored procedure:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }

          // Send the data as JSON response
          res.json({ data: result.recordset });
      });
  });
};


exports.menuaccess = (req, res) => {
  pool.connect((err, connection) => {
      if (err) {
          console.error('Error getting connection from pool:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }
      
      // Call the stored procedure
      const request = new sql.Request(connection);
      request.execute('dbo.GetMenuAccess', (err, result) => {
          connection.release(); // Release the connection back to the pool

          if (err) {
              console.error('Error executing stored procedure:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }

          // Send the data as JSON response
          res.json({ data: result.recordset });
      });
  });
};



//menu access/user
//salesretailprintpage
exports.getSalesretailProductDetails = (req, res) => {
  const salesId = req.query.salesId; // Extract salesId from query parameter

  // Use parameterized query to prevent SQL injection
  const request = pool.request();
  request.input('SalesId', sql.Int, salesId); // Add salesId as a parameter

  request.execute('dbo.GetSalesretailProductDetails', (err, result) => {
      if (err) {
          console.error('Error executing stored procedure:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Log the result
      console.log('Product details:', result.recordset);
    
      // Send the data as JSON response
      res.json({ data: result.recordset });
  });
};


exports.salesretaildetails = (req, res) => {
  const salesId = req.query.salesId; // Extract salesId from query parameter

  // Use parameterized query to prevent SQL injection
  const request = pool.request();
  request.input('SalesId', sql.Int, salesId); // Add salesId as a parameter

  request.execute('dbo.GetSalesretailsDetails', (err, result) => {
      if (err) {
          console.error('Error executing stored procedure:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Log the result
      console.log('Sales details:', result.recordset);
    
      // Send the data as JSON response
      res.json({ data: result.recordset });
  });
};

//salesretailprintpage


//salesprintpage
exports.getSalesProductDetails = (req, res) => {
  const salesId = req.query.salesId; // Extract salesId from query parameter

  // Use parameterized query to prevent SQL injection
  const request = pool.request();
  request.input('SalesId', sql.Int, salesId); // Add salesId as a parameter

  request.execute('dbo.GetSalesProductDetails', (err, result) => {
      if (err) {
          console.error('Error executing stored procedure:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Log the result
      console.log('Product details:', result.recordset);
    
      // Send the data as JSON response
      res.json({ data: result.recordset });
  });
};


exports.salesdetails = (req, res) => {
  const salesId = req.query.salesId; // Extract salesId from query parameter

  // Use parameterized query to prevent SQL injection
  const request = pool.request();
  request.input('SalesId', sql.Int, salesId); // Add salesId as a parameter

  request.execute('dbo.GetSalesDetails', (err, result) => {
      if (err) {
          console.error('Error executing stored procedure:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Log the result
      console.log('Sales details:', result.recordset);
    
      // Send the data as JSON response
      res.json({ data: result.recordset });
  });
};

//salesprintpage

//purchaseprintpage
exports.getProductDetails = (req, res) => {
  const purchaseId = req.query.purchaseId; // Extract purchaseId from query parameter

  // Use parameterized query to prevent SQL injection
  const request = pool.request();
  request.input('PurchaseId', sql.Int, purchaseId); // Add purchaseId as a parameter

  request.execute('dbo.GetProductDetails', (err, result) => {
      if (err) {
          console.error('Error executing stored procedure:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Log the result
      console.log('Product details:', result.recordset);
    
      // Send the data as JSON response
      res.json({ data: result.recordset });
  });
};

exports.purchasedetails = (req, res) => {
  const purchaseId = req.query.purchaseId; // Extract purchaseId from query parameter

  // Use parameterized query to prevent SQL injection
  const request = pool.request();
  request.input('PurchaseId', sql.Int, purchaseId); // Add purchaseId as a parameter

  request.execute('dbo.GetPurchasepDetails', (err, result) => {
      if (err) {
          console.error('Error executing stored procedure:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Log the result
      console.log('Purchase details:', result.recordset);
    
      // Send the data as JSON response
      res.json({ data: result.recordset });
  });
};

//purchaseprintpage
//purchasesales report
exports.purchaseoutstanding = (req, res) => {
  poolConnect()
      .then(pool => {
          const request = pool.request();

          request.execute('dbo.GetPurchaseOutstanding', (err, result) => {
              if (err) {
                  console.error('Error executing stored procedure:', err);
                  return res.status(500).json({ error: 'Internal Server Error' });
              }

              // Send the data as JSON response
              res.json({ data: result.recordset });
          });
      })
      .catch(error => {
          console.error('Error connecting to the database:', error.message);
          return res.status(500).json({ error: 'Internal Server Error' });
      });
};

 
//purchasesales report
//batchsummary
exports.currentstock = (req, res) => {
  poolConnect()
      .then(pool => {
          const request = pool.request();

          request.execute('dbo.GetCurrentStock', (err, result) => {
              if (err) {
                  console.error('Error executing stored procedure:', err);
                  return res.status(500).json({ error: 'Internal Server Error' });
              }

              // Send the data as JSON response
              res.json({ data: result.recordset });
          });
      })
      .catch(error => {
          console.error('Error connecting to the database:', error.message);
          return res.status(500).json({ error: 'Internal Server Error' });
      });
};


exports.batchsummary = (req, res) => {
  poolConnect()
      .then(pool => {
          const request = pool.request();

          request.execute('dbo.GetBatchSummary', (err, result) => {
              if (err) {
                  console.error('Error executing stored procedure:', err);
                  return res.status(500).json({ error: 'Internal Server Error' });
              }

              // Send the data as JSON response
              res.json({ data: result.recordset });
          });
      })
      .catch(error => {
          console.error('Error connecting to the database:', error.message);
          return res.status(500).json({ error: 'Internal Server Error' });
      });
};


exports.stocksummary = (req, res) => {
  poolConnect()
      .then(pool => {
          const request = pool.request();

          request.execute('dbo.GetStockSummary', (err, result) => {
              if (err) {
                  console.error('Error executing stored procedure:', err);
                  return res.status(500).json({ error: 'Internal Server Error' });
              }

              // Send the data as JSON response
              res.json({ data: result.recordset });
          });
      })
      .catch(error => {
          console.error('Error connecting to the database:', error.message);
          return res.status(500).json({ error: 'Internal Server Error' });
      });
};


exports.stockanalysis = (req, res) => {
  poolConnect()
      .then(pool => {
          const request = pool.request();

          request.execute('dbo.GetStockAnalysis', (err, result) => {
              if (err) {
                  console.error('Error executing stored procedure:', err);
                  return res.status(500).json({ error: 'Internal Server Error' });
              }

              // Send the data as JSON response
              res.json({ data: result.recordset });
          });
      })
      .catch(error => {
          console.error('Error connecting to the database:', error.message);
          return res.status(500).json({ error: 'Internal Server Error' });
      });
};

//batchsummary

 //mis
 exports.productwisepurcsale=(req,res)=>{
  pool.connect((err,connection)=>{
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    let query = `SELECT * FROM TrailBalance`; 
    connection.query(query, (err, result) => {
      connection.release();
      if (err) {
        console.error(`Error executing query: ${query}`, err);
        return res.status(400).json({ error: 'Bad Request' });
      }
      
      const formattedResult = result.map(row => ({...row, Date: formatDate(row.Date) }));
      return res.send(formattedResult);
    });
  });
};
 
exports.salesoutstanding = (req, res) => {
  poolConnect()
      .then(pool => {
          const request = pool.request();

          request.execute('dbo.GetSalesOutstanding', (err, result) => {
              if (err) {
                  console.error('Error executing stored procedure:', err);
                  return res.status(500).json({ error: 'Internal Server Error' });
              }

              // Send the data as JSON response
              res.json({ data: result.recordset });
          });
      })
      .catch(error => {
          console.error('Error connecting to the database:', error.message);
          return res.status(500).json({ error: 'Internal Server Error' });
      });
};


exports.billwise = (req, res) => {
  poolConnect()
      .then(pool => {
          const request = pool.request();

          request.execute('dbo.GetBillwise', (err, result) => {
              if (err) {
                  console.error('Error executing stored procedure:', err);
                  return res.status(500).json({ error: 'Internal Server Error' });
              }

              // Send the data as JSON response
              res.json({ data: result.recordset });
          });
      })
      .catch(error => {
          console.error('Error connecting to the database:', error.message);
          return res.status(500).json({ error: 'Internal Server Error' });
      });
};

//mis

//accounts  
exports.ledgerDr = (req, res) => {
  poolConnect()
      .then(pool => {
          const request = pool.request();

          request.execute('dbo.GetLedgerDr', (err, result) => {
              if (err) {
                  console.error('Error executing stored procedure:', err);
                  return res.status(500).json({ error: 'Internal Server Error' });
              }

              // Send the data as JSON response
              res.json({ data: result.recordset });
          });
      })
      .catch(error => {
          console.error('Error connecting to the database:', error.message);
          return res.status(500).json({ error: 'Internal Server Error' });
      });
};


exports.ledgerbook = (req, res) => {
  const selectedLedger = req.query.ledger;

  poolConnect()
    .then(pool => {
      const sqlQuery = `EXEC  [dbo].[GetDailyTransactions] @selectedLedger='${selectedLedger}'`; 

      const request = pool.request();
      request.input('selectedLedger', selectedLedger);
      request.query(sqlQuery, (err, result) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          return res.status(500).json({ error: 'Error executing SQL query' });
        }
      
        if (!result || !Array.isArray(result.recordset) || result.recordset.length === 0) {
          console.log('No data found for the selected ledger:', selectedLedger);
          return res.status(404).json({ error: 'No data found for the selected ledger' });
        }

        // Corrected the variable name here from `recordset` to `result.recordset`
        console.log('recordset result:', result.recordset);

        return res.json({ data: result.recordset });
      });
    })
    .catch(error => {
      console.error('Error connecting to the database:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    });
};

exports.bankledgerDr = (req, res) => {
  pool.connect((err, connection) => {
      if (err) {
          console.error('Error getting connection from pool:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      const request = connection.request();

      request.execute('dbo.GetBankLedgerDr', (err, result) => {
          connection.release(); // Release the connection back to the pool

          if (err) {
              console.error('Error executing stored procedure:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }

          // Send the data as JSON response
          res.json({ data: result.recordset });
      });
  });
};


exports.bankbook = (req, res) => {
  const selectedLedger = req.query.ledger;

  poolConnect()
      .then(pool => {
          const request = pool.request();
          request.input('selectedLedger', selectedLedger);

          request.execute('dbo.GetBankbook', (err, result) => {
              if (err) {
                  console.error('Error executing stored procedure:', err);
                  return res.status(500).json({ error: 'Internal Server Error' });
              }

              if (!result || !Array.isArray(result.recordset) || result.recordset.length === 0) {
                  console.log('No data found for the selected ledger:', selectedLedger);
                  return res.status(404).json({ error: 'No data found for the selected ledger' });
              }

              const formattedResult = result.recordset.map(row => ({
                  vh_no: row.vh_no,
                  vh_date: row.vh_date,
                  vh_type: row.vh_type,
                  dr_amount: row.dr_amount,
                  cr_amount: row.cr_amount,
                  discount: row.discount
              }));

              console.log('Formatted result:', formattedResult);

              return res.json({ data: formattedResult });
          });
      })
      .catch(error => {
          console.error('Error connecting to the database:', error.message);
          return res.status(500).json({ error: 'Internal Server Error' });
      });
};


exports.cashbook = (req, res) => {
  pool.connect((err, connection) => {
      if (err) {
          console.error('Error getting connection from pool:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }
      
      const request = connection.request();
      
      request.execute('dbo.GetCashbooks', (err, result) => {
          if (err) {
              console.error('Error executing stored procedure:', err);
              connection.close();
              return res.status(500).json({ error: 'Internal Server Error' });
          }

          const formattedResult = result.recordset.map(row => ({
              ...row,
              vh_date: row.vh_date 
          }));
          
          connection.close();
          return res.send(formattedResult);
      });
  });
};


exports.daybook = (req, res) => {
  pool.connect((err, connection) => {
      if (err) {
          console.error('Error getting connection from pool:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }
      
      const request = connection.request();
      
      request.execute('dbo.GetDaybook', (err, result) => {
          if (err) {
              console.error('Error executing stored procedure:', err);
              connection.close();
              return res.status(500).json({ error: 'Internal Server Error' });
          }

          const formattedResult = result.recordset.map(row => ({
              ...row,
              vh_date: row.vh_date 
          }));
          
          connection.close();
          return res.send(formattedResult);
      });
  });
};


exports.journalbook=(req,res)=>{
  pool.connect((err,connection)=>{
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    let query = `SELECT * FROM TrailBalance`; 
    connection.query(query, (err, result) => {
      connection.release();
      if (err) {
        console.error(`Error executing query: ${query}`, err);
        return res.status(400).json({ error: 'Bad Request' });
      }
      
      const formattedResult = result.map(row => ({...row, Date: formatDate(row.Date) }));
      return res.send(formattedResult);
    });
  });
};

exports.creditbook=(req,res)=>{
  pool.connect((err,connection)=>{
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    let query = `SELECT * FROM TrailBalance`; 
    connection.query(query, (err, result) => {
      connection.release();
      if (err) {
        console.error(`Error executing query: ${query}`, err);
        return res.status(400).json({ error: 'Bad Request' });
      }
      
      const formattedResult = result.map(row => ({...row, Date: formatDate(row.Date) }));
      return res.send(formattedResult);
    });
  });
};

exports.trailbalance=(req,res)=>{
  pool.connect((err,connection)=>{
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    let query = `SELECT * FROM TrailBalance`; 
    connection.query(query, (err, result) => {
      connection.release();
      if (err) {
        console.error(`Error executing query: ${query}`, err);
        return res.status(400).json({ error: 'Bad Request' });
      }
      
      const formattedResult = result.map(row => ({...row, Date: formatDate(row.Date) }));
      return res.send(formattedResult);
    });
  });
}

exports.profitandloss=(req,res)=>{
  pool.connect((err,connection)=>{
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    let query = `SELECT * FROM BalanceSheet`; 
    connection.query(query, (err, result) => {
      connection.release();
      if (err) {
        console.error(`Error executing query: ${query}`, err);
        return res.status(400).json({ error: 'Bad Request' });
      }
      
      const formattedResult = result.map(row => ({ ...row, Date: formatDate(row.Date) }));
      return res.send(formattedResult);
    });
  });
};

exports.balancesheet=(req,res)=>{
pool.connect((err,connection)=>{
  if (err) {
    console.error('Error getting connection from pool:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  let query = `SELECT * FROM BalanceSheet`; 
  connection.query(query, (err, result) => {
    connection.release();
    if (err) {
      console.error(`Error executing query: ${query}`, err);
      return res.status(400).json({ error: 'Bad Request' });
    }
    
    const formattedResult = result.map(row => ({ ...row, Date: formatDate(row.Date) }));
    return res.send(formattedResult);
  });
});
};

//aaccounts
//reports on gst
exports.gstPurchase = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    pool.query('EXEC GetGSTPurchase', (err, result) => {
      connection.release(); 
      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};

exports.gstsales = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    pool.query('EXEC GetGSTSales', (err, result) => {
      connection.release(); 
      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};

exports.hsnPurchase = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    pool.query('EXEC GetHSNPurchase', (err, result) => {
      connection.release(); 
      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};

exports.hsnsales = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    pool.query('EXEC GetHSNSales', (err, result) => {
      connection.release(); 
      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};


//reports on gst
//dashboard

exports.masterdata = async (req, res) => {
  try {
    const result = await pool.request().execute('GetMasterData');
    if (result.recordset.length > 0) {
      console.log('Master data retrieved successfully');

      // Extract counts from the result
      const customerCount = result.recordset[0].customer_count;
      const supplierCount = result.recordset[0].supplier_count;
      const salesmanCount = result.recordset[0].salesman_count;
      const ledgerCount = result.recordset[0].ledger_count;

      // Send the counts as JSON response
      res.status(200).json({
        success: true,
        customer_count: customerCount,
        supplier_count: supplierCount,
        salesman_count: salesmanCount,
        ledger_count: ledgerCount
      }); 
    } else {
      console.log('No master data found');
      res.status(404).json({ success: false, message: 'Master data not found' });
    }
  } catch (error) {
    console.error('Error fetching master data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


exports.salesData = async (req, res) => {
  try {
    const result = await pool.request().execute('GetSalesData');
    if (result.recordset.length > 0) {
      console.log('Sales data retrieved successfully');
      const sales = result.recordset.map(sale => ({
        saledate: sale.saledate,
        subtotal: sale.subtotal
      }));
      res.status(200).json({ success: true, sales });
    } else {
      console.log('No sales data found');
      res.status(404).json({ success: false, message: 'Sales data not found' });
    }
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


exports.supplierCount = async (req, res) => {
  try {
    const result = await pool.request().execute('GetSupplierCount');
    if (result.recordset.length > 0) {
      console.log('Supplier count retrieved successfully:', result.recordset[0].row_count);
      res.status(200).json({ success: true, supplierCount: result.recordset[0].row_count });
    } else {
      console.log('No supplier count found');
      res.status(404).json({ success: false, message: 'Supplier count not found' });
    }
  } catch (error) {
    console.error('Error fetching supplier count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.customerCount = async (req, res) => {
  try {
    const result = await pool.request().execute('GetCustomerCount');
    if (result.recordset.length > 0) {
      console.log('Customer count retrieved successfully:', result.recordset[0].row_count);
      res.status(200).json({ success: true, customerCount: result.recordset[0].row_count });
    } else {
      console.log('No customer count found');
      res.status(404).json({ success: false, message: 'Customer count not found' });
    }
  } catch (error) {
    console.error('Error fetching customer count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.productCount = async (req, res) => {
  try {
    const result = await pool.request().execute('GetProductCount');
    if (result.recordset.length > 0) {
      console.log('Product count retrieved successfully:', result.recordset[0].row_count);
      res.status(200).json({ success: true, row_count: result.recordset[0].row_count });
    } else {
      console.log('No product count found');
      res.status(404).json({ success: false, message: 'Product count not found' });
    }
  } catch (error) {
    console.error('Error fetching product count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


exports.purchaseCount = async (req, res) => {
  try {
    const result = await pool.request().execute('GetPurchaseCount');
    if (result.recordset.length > 0) {
      console.log('Purchase count retrieved successfully:', result.recordset[0].row_count);
      res.status(200).json({ success: true, row_count: result.recordset[0].row_count });
    } else {
      console.log('No purchase count found');
      res.status(404).json({ success: false, message: 'Purchase count not found' });
    }
  } catch (error) {
    console.error('Error fetching purchase count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


//dashboard
//company title 
const initializePool = async () => {
  try {
    await pool.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    throw error;
  }
};

initializePool();

exports.companyTitle = async (req, res) => {
  try {
    const result = await pool.request().execute('GetCompanyDetails');
    if (result.recordset.length > 0) {
      console.log('Company details retrieved successfully:', result.recordset[0]);
      res.status(200).json({ success: true, companyDetails: result.recordset[0] });
    } else {
      console.log('No company details found for the specified ID');
      res.status(404).json({ success: false, message: 'Company details not found for the specified ID' });
    }
  } catch (error) {
    console.error('Error fetching company details:', error);
    if (error.message.includes('connection is closed') || error.code === 'ECONNCLOSED') {
      try {
        await initializePool(); // Attempt to reinitialize the connection pool
        res.status(500).json({ success: false, message: 'Database connection closed. Please try again.' });
      } catch (reconnectError) {
        console.error('Error reconnecting to the database:', reconnectError);
        res.status(500).json({ success: false, message: 'Failed to reconnect to the database.' });
      }
    } else {
      // Handle other database errors
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
};
//company 

//salesReturn 
exports.customername = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT [id], [ledgername],[state] FROM [elite_pos].[dbo].[customer]', (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};

exports.batchDetails = async (req, res) => {
  const { selectedProductId } = req.body; 
  try {
      console.log('Selected Product ID:', selectedProductId); 
      const result = await pool.request()
        .input('selectedProductId', sql.Int, selectedProductId)
        .execute('GetBatchDetails');
      if (result.recordset.length > 0) {
          console.log('Batch details retrieved successfully:', result.recordset);
          res.status(200).json({ success: true, data: result.recordset });
      } else {
          // Return a 404 error if no batch details are found for the product ID
          console.log('No batch details found for the product ID:', selectedProductId);
          res.status(404).json({ success: false, message: 'No batch details found for the product ID.' });
      }
  } catch (error) {
      // Handle any errors that occur during database query or processing
      console.error('Error fetching batch details:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.salesReturnDetails=async(req,res)=>{
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const query = 'SELECT * FROM [elite_pos].[dbo].[salesReturn_Master]';

    pool.query(query, (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('Query Result:', result);

      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};

async function updateOrInsertStock(productId, batchNo, quantity, tax, rate, uom) {
  try {
    // Check if the product and batch number exist in the stock_Ob table
    const stockResult = await pool.query`
      SELECT Id FROM [elite_pos].[dbo].[stock_Ob] 
      WHERE [Product] = ${productId} AND [batchNo] = ${batchNo};
    `;

    if (stockResult.recordset.length > 0) {
      // If the product and batch number exist, update the op_quantity
      await pool.request()
        .input('productId', sql.Int, productId)
        .input('batchNo', sql.NVarChar, batchNo)
        .input('quantity', sql.Int, quantity)
        .query(`
          UPDATE [elite_pos].[dbo].[stock_Ob] 
          SET [op_quantity] = [op_quantity] + @quantity
          WHERE [Product] = @productId AND [batchNo] = @batchNo;
        `);

      console.log('Stock increased successfully for existing product:', productId, 'and batchNo:', batchNo);
    } else {
      // If the product and batch number don't exist, insert a new record
      await pool.request()
        .input('productId', sql.Int, productId)
        .input('batchNo', sql.VarChar, batchNo)
        .input('quantity', sql.Int, quantity)
        .input('tax', sql.VarChar, tax)
        .input('rate', sql.Decimal, rate)
        .input('uom', sql.VarChar, uom)
        .query(`
          INSERT INTO [elite_pos].[dbo].[stock_Ob] (Product, batchNo, quantity, tax, rate, uom, op_quantity)
          VALUES (@productId, @batchNo, @quantity, @tax, @rate, @uom, @quantity);
        `);

      console.log('New product added to stock_Ob: ProductId:', productId, 'BatchNo:', batchNo);
    }
  } catch (error) {
    console.error('Error updating or inserting stock:', error);
    throw error;
  }
}

exports.salesReturnadd = async (req, res) => {
  console.log(req.body);
  const {
      saledate,
      paymentmode,
      referno,
      transportno,
      customermobileno, 
      customername, 
      pamount,
      pigst,
      pcgst,
      psgst,
      psubtotal,
      pcess,
      ptcs,
      proundOff,
      pnetAmount,
      pdiscount,
      pdiscMode_, // Assuming this corresponds to the discount mode
      products: productsString,
  } = req.body;

  let parsedProducts = [];
  const formattedSaleDate = saledate ? saledate : null;

  try {
      // Establish database connection
      await poolConnect();

      // Parse products array from request body
      parsedProducts = JSON.parse(productsString);

      // Insert salesReturn master record
      const result = await pool.query`
          INSERT INTO [elite_pos].[dbo].[salesReturn_Master]
          ([saledate], [paymentmode], [referno], [transportno], [customermobileno], [customer], [amount], [cgst], [sgst], [igst], [netAmount], [cess], [tcs], [discMode], [discount], [subtotal], [roundoff])
          VALUES
          (${formattedSaleDate}, ${paymentmode}, ${referno}, ${transportno}, ${customermobileno}, ${customername}, ${pamount}, ${pcgst}, ${psgst}, ${pigst}, ${pnetAmount}, ${pcess}, ${ptcs}, ${pdiscMode_}, ${pdiscount}, ${psubtotal}, ${proundOff});

          SELECT SCOPE_IDENTITY() as salesReturnId;
      `;

      const salesReturnId = result.recordset[0].salesReturnId;
      console.log('Number of products:', parsedProducts.length);

      // Inserting Products
      for (const product of parsedProducts) {
          const { productId, batchNo, tax, quantity, uom,purcRate,mrp, rate, discMode, discount, amount, cgst, sgst, igst, totalAmount } = product;

          await pool.query`
              INSERT INTO [elite_pos].[dbo].[salesReturn_Trans]
              ([salesReturnId], [product], [batchNo], [tax], [quantity], [uom],[purcRate],[mrp], [rate], [discMode], [discount], [amount], [cgst], [sgst], [igst], [totalAmount])
              VALUES
              (${salesReturnId}, ${productId}, ${batchNo}, ${tax}, ${quantity}, ${uom},${purcRate} ,${mrp},${rate}, ${discMode}, ${discount}, ${amount}, ${cgst}, ${sgst}, ${igst}, ${totalAmount});
          `
          
          ;
          await increaseStock(productId, batchNo, quantity, uom, rate, tax);
      }

      res.status(200).json({ success: true, message: 'salesReturn added successfully' });
  } catch (error) {
      console.error('Error during salesReturn processing:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.salesReturnEdit = async (req, res) => {
  const { purchaseId } = req.params;
  const { purchaseDetails, products } = req.body;

  try {
    console.log('Received request to edit purchase:', req.body); 

    // Update salesReturn master table
    await pool.query`
        UPDATE [elite_pos].[dbo].[salesReturn_Master]
        SET
            [saledate] = ${purchaseDetails.saledate},
            [paymentmode] = ${purchaseDetails.paymentmode},
            [referno] = ${purchaseDetails.referno},
            [transportno] = ${purchaseDetails.transportno},
            [customermobileno] = ${purchaseDetails.customermobileno},
            [customer] = ${purchaseDetails.customername},
            [amount] = ${purchaseDetails.pamount},
            [cgst] = ${purchaseDetails.pcgst},
            [sgst] = ${purchaseDetails.psgst},
            [igst] = ${purchaseDetails.pigst},
            [netAmount] = ${purchaseDetails.pnetAmount},
            [cess] = ${purchaseDetails.pcess},
            [tcs] = ${purchaseDetails.ptcs},
            [discMode] = ${purchaseDetails.pdiscMode_},
            [discount] = ${purchaseDetails.pdiscount},
            [subtotal] = ${purchaseDetails.psubtotal},
            [roundoff] = ${purchaseDetails.proundOff}
        WHERE
            [id] = ${purchaseDetails.id};
    `;
    for (const product of products) {
      const { Id, productId, batchNo, tax, quantity, uom,purcRate,mrp ,rate, discMode, discount, amount, cgst, sgst, igst, totalAmount } = product;
      if (Id) {
        await pool.query`
          UPDATE [elite_pos].[dbo].[salesReturn_Trans]
          SET
              [product] = ${productId},
              [batchNo] = ${batchNo},
              [tax] = ${tax},
              [quantity] = ${quantity},
              [uom] = ${uom},
              [purcRate]=${purcRate},
              [mrp]=${mrp},
              [rate] = ${rate},
              [discMode] = ${discMode},
              [discount] = ${discount},
              [amount] = ${amount},
              [cgst] = ${cgst},
              [sgst] = ${sgst},
              [igst] = ${igst},
              [totalAmount] = ${totalAmount}
          WHERE
              [Id] = ${Id};
        `; 
      } else {
        await pool.query`
          INSERT INTO [elite_pos].[dbo].[salesReturn_Trans] ([salesReturnId], [product], [batchNo], [tax], [quantity], [uom],[purcRate], [rate], [discMode], [discount], [amount], [cgst], [sgst], [igst], [totalAmount])
          VALUES ( ${purchaseDetails.id}, ${productId}, ${batchNo}, ${tax}, ${quantity}, ${uom},${purcRate} ,${rate}, ${discMode}, ${discount}, ${amount}, ${cgst}, ${sgst}, ${igst}, ${totalAmount});
        `;
        await increaseStock(productId, batchNo, quantity, uom, rate, tax);
      }
    }
    console.log('salesReturn edited successfully'); 
    res.status(200).json({ success: true, message: 'salesReturn edited successfully' });
  } catch (error) {
    console.error('Error updating salesReturn:', error);
    res.status(400).json({ success: false, message: 'Failed to update salesReturn' });
  }
};

exports.salesReturnids = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const query = `
    SELECT 
    pt.*,
    s.ledgername AS customername
FROM 
    [elite_pos].[dbo].[salesReturn_Master] pt
JOIN
    [elite_pos].[dbo].[customer] s ON pt.[customer] = s.[id];
 
`;
    pool.query(query, (err, result) => {
      connection.release();
      if (err) {
        console.error('Error in fetching purchase IDs:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.header('Content-Type', 'application/json'); 
      res.json({ data: result.recordset });
    });
  });
};

exports.salesReturnproductid = (req, res) => {
  const purchaseId = req.query.purchaseId;
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const query = `
    SELECT 
    pt.Id,
    pt.product, 
    p.productname,
    dm.discMode,
    pt.batchNo,
    pt.tax,
    pt.quantity,
    pt.uom,
    pt.purcRate,
    pt.mrp,
    pt.rate,
    pt.discount,
    pt.amount,
    pt.cgst,
    pt.sgst,
    pt.igst,
    pt.totalAmount
FROM 
    [elite_pos].[dbo].[salesReturn_Trans] pt
JOIN
    [elite_pos].[dbo].[product] p ON pt.product = p.id
JOIN
    [elite_pos].[dbo].[discmode] dm ON pt.discMode = dm.id
WHERE 
    pt.salesReturnId = '${purchaseId}';
`;
  

    pool.query(query, (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('Query Result:', result);

      // Send the data as JSON response
      res.json({ data: result.recordset.map(row => ({ ...row, product: row.productname })) });
    });
  });
};

exports.salesReturndelete = async (req, res) => {
  const purchaseId = req.params.id; 
  try {
      await poolConnect();
      if (purchaseId) {
          // Retrieve product IDs and batch numbers from salesReturn_Trans
          const { recordset } = await pool.request()
              .input('purchaseId', sql.Int, purchaseId)
              .query(`
                  SELECT product, batchNo, quantity
                  FROM [elite_pos].[dbo].[salesReturn_Trans]
                  WHERE [salesReturnId] = @purchaseId
              `);
          // Delete from salesReturn_Master
          await pool.request()
              .input('purchaseId', sql.Int, purchaseId)
              .query('DELETE FROM [elite_pos].[dbo].[salesReturn_Master] WHERE [id] = @purchaseId');
          // Delete associated products from salesReturn_Trans
          await pool.request()
              .input('purchaseId', sql.Int, purchaseId)
              .query('DELETE FROM [elite_pos].[dbo].[salesReturn_Trans] WHERE [salesReturnId] = @purchaseId');

          // Update stock_Ob based on deleted products and batches
          for (const { product, batchNo, quantity } of recordset) {
              await reduceStock(product, quantity, batchNo);
          }

          res.status(200).json({ success: true, message: 'Purchase and associated products deleted successfully' });
      } else {
          throw new Error('No purchaseId provided');
      }
  } catch (error) {
      console.error('Error during purchase deletion:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.salesReturntransdelete = async (req, res) => {
  const manufacturerId = req.params.id;
  try {
      // Ensure the database connection is established before proceeding
      await poolConnect();
      const { recordset } = await pool.request()
          .input('manufacturerId', sql.Int, manufacturerId)
          .query('SELECT product, quantity, batchNo FROM [elite_pos].[dbo].[salesReturn_Trans] WHERE Id = @manufacturerId');

      // Check if a record was found
      if (recordset.length === 0) {
          return res.status(404).json({ success: false, error: "Sales return transaction not found" });
      }

      const { product, quantity, batchNo } = recordset[0];

      const result = await pool.request()
          .input('manufacturerId', sql.Int, manufacturerId)
          .query('DELETE FROM [elite_pos].[dbo].[salesReturn_Trans] WHERE Id = @manufacturerId');
      
      await reduceStock(product, quantity, batchNo);

      if (result.rowsAffected[0] > 0) {
          return res.json({ success: true, message: "Sales return transaction deleted successfully" });
      } else {
          return res.status(404).json({ success: false, error: "Sales return transaction not found" });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.salesReturnregister = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query(`
      SELECT *
      FROM [elite_pos].[dbo].[salesReturn_Master] 
   ;
    `, (err, result) => {
      connection.release(); 
      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};
 //salesReturn

 //sales 
exports.customername = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT [id], [ledgername],[state],[mobile] FROM [elite_pos].[dbo].[customer]', (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};

exports.batchDetails = async (req, res) => {
  const { selectedProductId } = req.body; 
  try {
      console.log('Selected Product ID:', selectedProductId); 
      const result = await pool.query(`
          SELECT 
              [batchNo],
              [tax],
              [op_quantity],
              [uom],
              [rate] ,
              [mrp]
          FROM 
              [elite_pos].[dbo].[stock_Ob]
          WHERE 
              product = ${selectedProductId};
      `);
      if (result.recordset.length > 0) {
          console.log('Batch details retrieved successfully:', result.recordset);
          res.status(200).json({ success: true, data: result.recordset });
      } else {
          // Return a 404 error if no batch details are found for the product ID
          console.log('No batch details found for the product ID:', selectedProductId);
          res.status(404).json({ success: false, message: 'No batch details found for the product ID.' });
      }
  } catch (error) {
      // Handle any errors that occur during database query or processing
      console.error('Error fetching batch details:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.salesDetails=async(req,res)=>{
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const query = 'SELECT * FROM [elite_pos].[dbo].[sales_Master]';

    pool.query(query, (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('Query Result:', result);

      res.json({ data: result.recordset });
    });
  });
}

exports.salesadd = async (req, res) => {
  console.log(req.body);
  const {
      saledate,
      paymentmode,
      referno,
      transportno,
      customermobileno, 
      customername, 
      pamount,
      pigst,
      pcgst,
      psgst,
      psubtotal,
      pcess,
      ptcs,
      proundOff,
      pnetAmount,
      pdiscount,
      pdiscMode_, 
      products: productsString,
  } = req.body;

  let parsedProducts = [];
  const formattedSaleDate = saledate ? saledate : null;

  try {
      // Establish database connection
      await poolConnect();

      // Parse products array from request body
      parsedProducts = JSON.parse(productsString);

      // Insert sales master record
      const result = await pool.query`
          INSERT INTO [elite_pos].[dbo].[sales_Master]
          ([saledate], [paymentmode], [referno], [transportno], [customermobileno], [customer], [amount], [cgst], [sgst], [igst], [netAmount], [cess], [tcs], [discMode], [discount], [subtotal], [roundoff])
          VALUES
          (${formattedSaleDate}, ${paymentmode}, ${referno}, ${transportno}, ${customermobileno}, ${customername}, ${pamount}, ${pcgst}, ${psgst}, ${pigst}, ${pnetAmount}, ${pcess}, ${ptcs}, ${pdiscMode_}, ${pdiscount}, ${psubtotal}, ${proundOff});

          SELECT SCOPE_IDENTITY() as salesId;
      `;

      const salesId = result.recordset[0].salesId;
      console.log('Number of products:', parsedProducts.length);

      for (const product of parsedProducts) {
        const { productId, batchNo, tax, quantity, uom, purcRate,mrp, rate, discMode, discount, amount, cgst, sgst, igst, totalAmount } = product;
    
        // Insert sales transaction record
        await pool.query`
            INSERT INTO [elite_pos].[dbo].[sales_Trans]
            ([salesId], [product], [batchNo], [tax], [quantity], [uom],[purcRate], [mrp],[rate], [discMode], [discount], [amount], [cgst], [sgst], [igst], [totalAmount])
            VALUES
            (${salesId}, ${productId}, ${batchNo}, ${tax}, ${quantity}, ${uom},${purcRate},${mrp} ,${rate}, ${discMode}, ${discount}, ${amount}, ${cgst}, ${sgst}, ${igst}, ${totalAmount});
        `;
    
        // Reduce stock quantity
        await reduceStock(productId, quantity, batchNo);
    }
    

      res.status(200).json({ success: true, message: 'Sales added successfully' });
  } catch (error) {
      console.error('Error during sales processing:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.salesEdit = async (req, res) => {
  const { purchaseId } = req.params;
  const { purchaseDetails, products } = req.body;
  try {
    console.log('Received request to edit purchase:', req.body); 
    // Update sales master table
    await pool.query`
        UPDATE [elite_pos].[dbo].[sales_Master]
        SET
            [saledate] = ${purchaseDetails.saledate},
            [paymentmode] = ${purchaseDetails.paymentmode},
            [referno] = ${purchaseDetails.referno},
            [transportno] = ${purchaseDetails.transportno},
            [customermobileno] = ${purchaseDetails.customermobileno},
            [customer] = ${purchaseDetails.customername},
            [amount] = ${purchaseDetails.pamount},
            [cgst] = ${purchaseDetails.pcgst},
            [sgst] = ${purchaseDetails.psgst},
            [igst] = ${purchaseDetails.pigst},
            [netAmount] = ${purchaseDetails.pnetAmount},
            [cess] = ${purchaseDetails.pcess},
            [tcs] = ${purchaseDetails.ptcs},
            [discMode] = ${purchaseDetails.pdiscMode_},
            [discount] = ${purchaseDetails.pdiscount},
            [subtotal] = ${purchaseDetails.psubtotal},
            [roundoff] = ${purchaseDetails.proundOff}
        WHERE
            [id] = ${purchaseDetails.id};
    `;
    for (const product of products) {
      const { Id, productId, batchNo, tax, quantity, uom,purcRate,mrp ,rate, discMode, discount, amount, cgst, sgst, igst, totalAmount } = product;
      if (Id) {
        await pool.query`
          UPDATE [elite_pos].[dbo].[sales_Trans]
          SET
              [product] = ${productId},
              [batchNo] = ${batchNo},
              [tax] = ${tax},
              [quantity] = ${quantity},
              [uom] = ${uom},
              [purcRate]=${purcRate},
                [mrp]=${mrp},
              [rate] = ${rate},
              [discMode] = ${discMode},
              [discount] = ${discount},
              [amount] = ${amount},
              [cgst] = ${cgst},
              [sgst] = ${sgst},
              [igst] = ${igst},
              [totalAmount] = ${totalAmount}
          WHERE
              [Id] = ${Id};
        `; 
      } else {
        await pool.query`
          INSERT INTO [elite_pos].[dbo].[sales_Trans] ([salesId], [product], [batchNo], [tax], [quantity], [uom],[purcRate],[mrp], [rate], [discMode], [discount], [amount], [cgst], [sgst], [igst], [totalAmount])
          VALUES ( ${purchaseDetails.id}, ${productId}, ${batchNo}, ${tax}, ${quantity}, ${uom},${purcRate} ,${mrp} ,${rate}, ${discMode}, ${discount}, ${amount}, ${cgst}, ${sgst}, ${igst}, ${totalAmount});
        `
         // Reduce stock quantity
         await reduceStock(productId, quantity,batchNo);
        ;
      }
    }
    console.log('Sales edited successfully'); 
    res.status(200).json({ success: true, message: 'Sales edited successfully' });
  } catch (error) {
    console.error('Error updating sales:', error);
    res.status(400).json({ success: false, message: 'Failed to update sales' });
  }
};

async function reduceStock(productId, quantity, batchNo) {
  try {
    // First, retrieve the package value for the given productId from the product table
    const result = await pool.query`
      SELECT [package] FROM [elite_pos].[dbo].[product]
      WHERE [id] = ${productId};
    `;

    const packageValue = result.recordset[0].package;

    // Calculate the reduction in retailQty
    const retailQtyReduction = quantity * packageValue;

    // Update both op_quantity and retailQty in the stock_Ob table
    await pool.query`
        UPDATE [elite_pos].[dbo].[stock_Ob] 
        SET 
          [op_quantity] = [op_quantity] - ${quantity}, 
          [retailQty] = [retailQty] - ${retailQtyReduction}
        WHERE [product] = ${productId} AND [batchNo] = ${batchNo};
    `;
  } catch (error) {
    console.error("Error reducing stock:", error);
    throw error;
  }
}


exports.salesids = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const query = `
                  SELECT 
                  pt.*,
                  s.ledgername AS customername
              FROM 
                  [elite_pos].[dbo].[sales_Master] pt
              JOIN
                  [elite_pos].[dbo].[customer] s ON pt.[customer] = s.[id];
              
              `;
    pool.query(query, (err, result) => {
      connection.release();
      if (err) {
        console.error('Error in fetching purchase IDs:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.header('Content-Type', 'application/json'); 
      res.json({ data: result.recordset });
    });
  });
};

exports.saleproductid = (req, res) => {
  const purchaseId = req.query.purchaseId;
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const query = `
    SELECT 
    pt.Id,
    pt.product, -- Assuming this is the product ID
    p.productname,
    dm.discMode,
    pt.batchNo,
    pt.tax,
    pt.quantity,
    pt.uom,
    pt.purcRate,
     pt.mrp,
    pt.rate,
    pt.discount,
    pt.amount,
    pt.cgst,
    pt.sgst,
    pt.igst,
    pt.totalAmount
FROM 
    [elite_pos].[dbo].[sales_Trans] pt
JOIN
    [elite_pos].[dbo].[product] p ON pt.product = p.id
JOIN
    [elite_pos].[dbo].[discmode] dm ON pt.discMode = dm.id
WHERE 
    pt.salesId = '${purchaseId}';
`;
  
    pool.query(query, (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('Query Result:', result);

      // Send the data as JSON response
      res.json({ data: result.recordset.map(row => ({ ...row, product: row.productname })) });
    });
  });
};

exports.salesdelete = async (req, res) => {
  const salesId = req.params.id;

  try {
    await poolConnect();

    if (!salesId) {
      throw new Error("No salesId provided");
    }

    // Fetch transaction details associated with the salesId
    const transDetailsResult = await pool.query`
      SELECT Id, product, batchNo, quantity, tax, uom, rate, mrp
      FROM [elite_pos].[dbo].[sales_Trans]
      WHERE [salesId] = ${salesId};
    `;

    const transactions = transDetailsResult.recordset;

    // Iterate through each transaction
    for (const transaction of transactions) {
      const {
        Id: transactionId,
        product,
        batchNo,
        quantity,
        tax,
        uom,
        rate,
        mrp,
      } = transaction;

      // Increase stock quantity using the increaseStock function
      await increaseStock(product, batchNo, quantity, uom, rate, tax, mrp);
    }

    // Delete from sales_Master
    await pool.query`
      DELETE FROM [elite_pos].[dbo].[sales_Master]
      WHERE [id] = ${salesId};
    `;

    // Delete associated products from sales_Trans
    await pool.query`
      DELETE FROM [elite_pos].[dbo].[sales_Trans]
      WHERE [salesId] = ${salesId};
    `;

    res
      .status(200)
      .json({
        success: true,
        message: "Sales and associated products deleted successfully",
      });
  } catch (error) {
    console.error("Error during sales deletion:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


exports.salestransdelete = async (req, res) => {
  const manufacturerId = req.params.id;
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const { recordset } = await pool.request()
      .input('manufacturerId', sql.Int, manufacturerId)
      .query('SELECT quantity, Product, batchNo, uom, rate, tax FROM [elite_pos].[dbo].[sales_Trans] WHERE Id = @manufacturerId');

    // Check if a record was found
    if (recordset.length === 0) {
      return res.status(404).json({ success: false, error: "Purchased product not found" });
    }

    // Extract the quantity, productId, batchNo, uom, rate, and tax values from the recordset
    const { quantity, Product: productId, batchNo ,uom, rate, tax } = recordset[0];

    // Log the quantity to inspect its value
    console.log('Quantity:', quantity);

    // Delete the sales transaction
    const result = await pool.request()
      .input('manufacturerId', sql.Int, manufacturerId)
      .query('DELETE FROM [elite_pos].[dbo].[sales_Trans] WHERE Id = @manufacturerId');

    // Update the stock in the stock_Ob table based on the productId, batchNo, and retrieved quantity
    await increaseStock(productId, batchNo, quantity, uom, rate, tax);

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Purchased product deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "Purchased product not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.salesregister = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query(`
    SELECT s.*, c.ledgername
    FROM [elite_pos].[dbo].[sales_Master] s
    JOIN [elite_pos].[dbo].[customer] c ON s.customer = c.id;
    
   ;
    `, (err, result) => {
      connection.release(); 
      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};
 //sales

 //purchasereturn 
 exports.PurchasereturnDetails=async(req,res)=>{
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const query = 'SELECT * FROM [elite_pos].[dbo].[PurchaseTableReturn_Master]';

    pool.query(query, (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('Query Result:', result);

      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};

exports.Purchasereturnadd = async (req, res) => {
  console.log(req.body);
  const {
    purchasedate,
    paymentmode,
    supplierinvoicedate,
    modeoftransport,
    transportno,
    supplierinvoiceamount,
    supplierinvoiceno,
    suppliername,
    pamount,
    pcgst,
    psgst,
    pigst,
    pnetAmount,   
    pcess,
    ptcs,
    pdiscMode_,
    pdiscount,
    psubtotal,
    proundOff,
    isDraft,
    products: productsString,  
  } = req.body;

  let parsedProducts = [];

  const formattedPurchaseDate = purchasedate ? purchasedate : null; 
  const formattedsupplierinvoicedate = supplierinvoicedate ? supplierinvoicedate : null;

  try {
  
    await poolConnect();

    parsedProducts = JSON.parse(productsString);  

    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[PurchaseTableReturn_Master]
      ([purchasedate], [paymentmode], [supplierinvoicedate], [modeoftransport], [transportno], [supplierinvoiceamount], [supplierinvoiceno], [suppliername],[amount],[cgst],[sgst],[igst],[netAmount],[cess],[tcs],[discMode],[discount],[subtotal],[roundoff],[isDraft])
      VALUES
      (${formattedPurchaseDate}, ${paymentmode}, ${formattedsupplierinvoicedate}, ${modeoftransport}, ${transportno}, ${supplierinvoiceamount}, ${supplierinvoiceno}, ${suppliername},${pamount},${pcgst},${psgst},${pigst},${pnetAmount},${pcess},${ptcs},${pdiscMode_},${pdiscount},${psubtotal},${proundOff},${isDraft});

      SELECT SCOPE_IDENTITY() as purchaseId;`;

    const purchaseId = result.recordset[0].purchaseId;
    console.log('Number of products:', parsedProducts.length);

    // Inserting Products
    for (const product of parsedProducts) {
      const { productId, batchNo, tax,quantity,uom,rate,mrp, discMode, discount, amount, cgst, sgst, igst, totalAmount } = product;

      await pool.query`
          INSERT INTO [elite_pos].[dbo].[PurchaseTableReturn_Trans]
          ([purchaseId], [product], [batchNo], [tax], [quantity], [uom], [rate],[mrp],[discMode], [discount], [amount], [cgst], [sgst], [igst], [totalAmount])
          VALUES
          (${purchaseId}, ${productId}, ${batchNo}, ${tax}, ${quantity}, ${uom}, ${rate},${mrp}, ${discMode}, ${discount}, ${amount}, ${cgst}, ${sgst}, ${igst}, ${totalAmount});
      `
      
      ;
      await reduceStock(productId, quantity, batchNo);
     

    }

    res.status(200).json({ success: true, message: 'Purchase added successfully' });
  } catch (error) {
    console.error('Error during purchase processing:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
 
exports.PurchasereturnEdit = async (req, res) => {
  const { purchaseId } = req.params;
  const { purchaseDetails, products } = req.body;

  try {
    console.log('Received request to edit purchase:', req.body); 
    await pool.query`
    UPDATE [elite_pos].[dbo].[PurchaseTableReturn_Master]
    SET
        [purchaseDate] = ${purchaseDetails.purchaseDate},
        [paymentMode] = ${purchaseDetails.paymentMode},
        [supplierInvoiceDate] = ${purchaseDetails.supplierInvoiceDate},
        [modeOfTransport] = ${purchaseDetails.modeOfTransport},
        [transportNo] = ${purchaseDetails.transportNo},
        [supplierInvoiceAmount] = ${purchaseDetails.supplierInvoiceAmount},
        [supplierInvoiceNo] = ${purchaseDetails.supplierInvoiceNo},
        [supplierName] = ${purchaseDetails.supplierName},
        [amount] = ${purchaseDetails.pAmount},
        [cgst] = ${purchaseDetails.pCgst},
        [sgst] = ${purchaseDetails.pSgst},
        [igst] = ${purchaseDetails.pIgst},
        [netAmount] = ${purchaseDetails.pNetAmount},
        [cess] = ${purchaseDetails.pCess},
        [tcs] = ${purchaseDetails.pTcs},
        [discMode] = ${purchaseDetails.pdiscMode_},
        [discount] = ${purchaseDetails.pdiscount},
        [subtotal] = ${purchaseDetails.pSubtotal},
        [roundoff] = ${purchaseDetails.proundOff},
        [isDraft] = ${purchaseDetails.isDraft}
    WHERE
        [id] = ${purchaseDetails.id};
    
    `;
    for (const product of products) {
      const { Id, productId, batchNo, tax, quantity, uom, rate,mrp, discMode, discount, amount, cgst, sgst, igst, totalAmount } = product;
      if (Id) {
        await pool.query`
          UPDATE [elite_pos].[dbo].[PurchaseTableReturn_Trans]
          SET
              [product] = ${productId},
              [batchNo] = ${batchNo},
              [tax] = ${tax},
              [quantity] = ${quantity},
              [uom] = ${uom},
              [rate] = ${rate},
               [mrp] = ${mrp},
              [discMode] = ${discMode},
              [discount] = ${discount},
              [amount] = ${amount},
              [cgst] = ${cgst},
              [sgst] = ${sgst},
              [igst] = ${igst},
              [totalAmount] = ${totalAmount}
          WHERE
              [Id] = ${Id};
        `; 
      } else {
        await pool.query`
          INSERT INTO [elite_pos].[dbo].[PurchaseTableReturn_Trans] ([purchaseId], [product], [batchNo], [tax], [quantity], [uom], [rate],[mrp], [discMode], [discount], [amount], [cgst], [sgst], [igst], [totalAmount])
          VALUES (${purchaseDetails.id}, ${productId}, ${batchNo}, ${tax}, ${quantity}, ${uom}, ${rate},${mrp}, ${discMode}, ${discount}, ${amount}, ${cgst}, ${sgst}, ${igst}, ${totalAmount});
        `;
        await reduceStock(productId, quantity, batchNo);
      }
    }
    console.log('Purchase edited successfully'); 
    res.status(200).json({ success: true, message: 'Purchase edited successfully' });
  } catch (error) {
    console.error('Error updating purchase:', error);
    res.status(400).json({ success: false, message: 'Failed to update purchase' });
  }
};

exports.Purchasereturnids = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const query = `
    SELECT 
    pt.*,
    s.ledgername as ledgername
FROM 
    [elite_pos].[dbo].[PurchaseTableReturn_Master] pt
JOIN
    [elite_pos].[dbo].[supplier] s ON pt.[suppliername] = s.[id];
`;
    pool.query(query, (err, result) => {
      connection.release();
      if (err) {
        console.error('Error in fetching purchase IDs:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.header('Content-Type', 'application/json'); // Set Content-Type header
      res.json({ data: result.recordset });
    });
  });
};

exports.PurchasereturnId = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const query = `
   
    SELECT
    pt.id AS purchaseId,
    pt.purchasedate,
    pt.paymentmode,
    pt.supplierinvoicedate,
    pt.modeoftransport,
    pt.transportno,
    pt.supplierinvoiceamount,
    pt.supplierinvoiceno,
    pt.suppliername,
    pr.productId,
    pr.productName,
    pr.batchNo,
    pr.tax,
    pr.kgs,
    pr.nos,
    pr.rate,
    pr.discMode,
    pr.discount,
    pr.amount,
    pr.cgst,
    pr.sgst,
    pr.igst,
    pr.totalAmount
FROM
    [elite_pos].[dbo].[PurchaseTableReturn_Master] AS pt
JOIN
    [elite_pos].[dbo].[PurchaseTableReturn_Trans] AS pr
ON
    pt.id = pr.purchaseId;

    `;

    const request = connection.request();
    
    request.query(query, (err, result) => {
      connection.release();

      if (err) {
        console.error('Error in fetching data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json({ data: result.recordset });
    });
  });
};

exports.productreturnid = (req, res) => {
  const purchaseId = req.query.purchaseId;
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const query = `
    SELECT 
    pt.Id,
    pt.product, -- Assuming this is the product ID
    p.productname,
    dm.discMode,
    pt.batchNo,
    pt.tax,
    pt.quantity,
    pt.uom,
    pt.rate,
    pt.mrp,
    pt.discount,
    pt.amount,
    pt.cgst,
    pt.sgst,
    pt.igst,
    pt.totalAmount
FROM 
    [elite_pos].[dbo].[PurchaseTableReturn_Trans] pt
JOIN
    [elite_pos].[dbo].[product] p ON pt.product = p.id
JOIN
    [elite_pos].[dbo].[discmode] dm ON pt.discMode = dm.id
WHERE 
    pt.PurchaseId = '${purchaseId}';
`;
    pool.query(query, (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('Query Result:', result);

      // Send the data as JSON response
      res.json({ data: result.recordset.map(row => ({ ...row, product: row.productname })) });
    });
  });
};

exports.Purchasereturndelete = async (req, res) => {
  const purchaseId = req.params.id; 
  try {
    await poolConnect();

    if (!purchaseId) {
      throw new Error('No purchaseId provided');
    }

    // Fetch transaction details associated with the purchaseId
    const transDetailsResult = await pool.query`
      SELECT Id, product, batchNo, quantity, tax, uom, rate, mrp
      FROM [elite_pos].[dbo].[PurchaseTableReturn_Trans]
      WHERE [purchaseId] = ${purchaseId};
    `;

    // Extract transaction details
    const transactions = transDetailsResult.recordset;

    // Iterate through each transaction
    for (const transaction of transactions) {
      const { Id: transactionId, product, batchNo, quantity, tax, uom, rate, mrp } = transaction;

      // Increase stock quantity using the increaseStock function
      await increaseStock(product, batchNo, quantity, uom, rate, tax, mrp);
    }

    // Delete from PurchaseTableReturn_Master
    await pool.query`
      DELETE FROM [elite_pos].[dbo].[PurchaseTableReturn_Master]
      WHERE [id] = ${purchaseId};
    `;
    
    // Delete associated products from PurchaseTableReturn_Trans
    await pool.query`
      DELETE FROM [elite_pos].[dbo].[PurchaseTableReturn_Trans]
      WHERE [purchaseId] = ${purchaseId};
    `;

    res.status(200).json({ success: true, message: 'Purchase and associated products deleted successfully' });
  } catch (error) {
    console.error('Error during purchase deletion:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.Purchasereturntransdelete = async (req, res) => {
  const manufacturerId = req.params.id;
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const { recordset } = await pool.request()
      .input('manufacturerId', sql.Int, manufacturerId)
      .query('SELECT quantity, Product, batchNo, uom, rate,mrp, tax FROM [elite_pos].[dbo].[PurchaseTableReturn_Trans] WHERE Id = @manufacturerId');

    // Check if a record was found
    if (recordset.length === 0) {
      return res.status(404).json({ success: false, error: "Purchased product not found" });
    }

    // Extract the quantity, productId, batchNo, uom, rate, and tax values from the recordset
    const { quantity, Product: productId, batchNo ,uom, rate,mrp, tax } = recordset[0];

    // Log the quantity to inspect its value
    console.log('Quantity:', quantity);

    // Delete the sales transaction
    const result = await pool.request()
      .input('manufacturerId', sql.Int, manufacturerId)
      .query('DELETE FROM [elite_pos].[dbo].[PurchaseTableReturn_Trans] WHERE Id = @manufacturerId');

    // Update the stock in the stock_Ob table based on the productId, batchNo, and retrieved quantity
    await increaseStock(productId, batchNo, quantity, uom, rate,mrp, tax);

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Purchased product deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "Purchased product not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

async function increaseStock(
  productId,
  batchNo,
  quantity,
  uom,
  rate,
  tax,
  mrp
) {
  try {
    // Step 1: Retrieve the package value for the product
    const packageQuery = `
      SELECT [package] FROM [elite_pos].[dbo].[product]
      WHERE [id] = @productId;
    `;

    const packageResult = await pool
      .request()
      .input("productId", sql.Int, productId)
      .query(packageQuery);

    if (packageResult.recordset.length === 0) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const packageValue = packageResult.recordset[0].package;
    console.log(`Package value for product ${productId}: ${packageValue}`);

    // Step 2: Calculate the retail quantity increase
    const retailQtyIncrease = quantity * packageValue;
    console.log(`Retail quantity increase calculated: ${retailQtyIncrease}`);

    // Step 3: Update existing row - Focus on retailQty
    const updateQuery = `
      UPDATE [elite_pos].[dbo].[stock_Ob]
      SET 
        [op_quantity] = [op_quantity] + @quantity,
        [retailQty] = ISNULL([retailQty], 0) + @retailQtyIncrease
      WHERE [product] = @productId AND [batchNo] = @batchNo;
    `;

    const updateResult = await pool
      .request()
      .input("productId", sql.Int, productId)
      .input("batchNo", sql.VarChar, batchNo)
      .input("quantity", sql.Decimal, quantity)
      .input("retailQtyIncrease", sql.Decimal, retailQtyIncrease)
      .query(updateQuery);

    console.log(`Rows affected by update: ${updateResult.rowsAffected[0]}`);

    if (updateResult.rowsAffected[0] === 0) {
      console.log(
        `No existing stock found for product ${productId} with batch ${batchNo}. Inserting new record.`
      );

      // Step 4: Insert new row if update failed
      const insertQuery = `
        INSERT INTO [elite_pos].[dbo].[stock_Ob] 
        ([product], [batchNo], [quantity], [uom], [rate], [mrp], [tax], [op_quantity], [retailQty])
        VALUES 
        (@productId, @batchNo, @quantity, @uom, @rate, @mrp, @tax, @quantity, @retailQtyIncrease); 
      `;

      await pool
        .request()
        .input("productId", sql.Int, productId)
        .input("batchNo", sql.VarChar, batchNo)
        .input("quantity", sql.Decimal, quantity)
        .input("uom", sql.VarChar, uom)
        .input("rate", sql.Decimal, rate)
        .input("mrp", sql.Decimal, mrp)
        .input("tax", sql.Decimal, tax)
        .input("retailQtyIncrease", sql.Decimal, retailQtyIncrease)
        .query(insertQuery);

      console.log("New stock record inserted.");
    } else {
      console.log(
        "Stock record updated successfully for productId:",
        productId
      );
    }
  } catch (error) {
    console.error("Error increasing stock:", error);
    throw error;
  }
}

exports.Purchasereturnregister = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query(`
      SELECT P.*, S.ledgername AS suppliername
      FROM [elite_pos].[dbo].[PurchaseTableReturn_Master] AS P
      INNER JOIN [elite_pos].[dbo].[Supplier] AS S ON P.suppliername = S.id;
    `, (err, result) => {
      connection.release(); 
      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};

//purchasereturn

//purchase
exports.purchasedelete = async (req, res) => {
  const purchaseId = req.params.id;

  try {
    await poolConnect();

    if (!purchaseId) {
      throw new Error('No purchaseId provided');
    }

    // Fetch the Ids of the PurchaseTable_Trans records for the given purchaseId
    const transIdsResult = await pool.query`
      SELECT Id FROM [elite_pos].[dbo].[PurchaseTable_Trans]
      WHERE [purchaseId] = ${purchaseId};
    `;

    // Extracting the Ids from the result
    const transIds = transIdsResult.recordset.map(record => record.Id);

    // Begin a transaction
    const transaction = await pool.transaction();
    await transaction.begin();

    try {
      // Delete from PurchaseTable_Master
      await transaction.request()
        .query(`DELETE FROM [elite_pos].[dbo].[PurchaseTable_Master] WHERE [id] = ${purchaseId}`);

      // Delete from PurchaseTable_Trans
      await transaction.request()
        .query(`DELETE FROM [elite_pos].[dbo].[PurchaseTable_Trans] WHERE [purchaseId] = ${purchaseId}`);

      // Delete corresponding records from stock_Ob
      for (const transId of transIds) {
        await transaction.request()
          .query(`DELETE FROM [elite_pos].[dbo].[stock_Ob] WHERE [Id] = ${transId}`);
      }

      // Commit the transaction
      await transaction.commit();

      res.status(200).json({ success: true, message: 'Purchase and associated products deleted successfully' });
    } catch (error) {
    // Rollback the transaction
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error during purchase deletion:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.purchasetransdelete = async (req, res) => {
  const purchaseTransId = req.params.id;
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();
    
    // Begin a transaction
    const transaction = pool.transaction();
    await transaction.begin();

    // Delete from PurchaseTable_Trans
    const deleteTransResult = await transaction.request()
      .input('purchaseTransId', sql.Int, purchaseTransId)
      .query('DELETE FROM [elite_pos].[dbo].[PurchaseTable_Trans] WHERE Id = @purchaseTransId');

    if (deleteTransResult.rowsAffected[0] === 0) {
      await transaction.rollback();
      return res.status(404).json({ success: false, error: "Purchased product not found" });
    }

    // Delete from stock_Ob
    const deleteStockResult = await transaction.request()
      .input('purchaseTransId', sql.Int, purchaseTransId)
      .query('DELETE FROM [elite_pos].[dbo].[stock_Ob] WHERE Id = @purchaseTransId');

    if (deleteStockResult.rowsAffected[0] === 0) {
      await transaction.rollback();
      return res.status(500).json({ success: false, error: "Failed to delete stock details" });
    }

    // Commit the transaction
    await transaction.commit();

    return res.json({ success: true, message: "Purchased product and related stock details deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.purchaseregister = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    pool.query(`
      SELECT P.*, S.ledgername AS suppliername
      FROM [elite_pos].[dbo].[PurchaseTable_Master] AS P
      INNER JOIN [elite_pos].[dbo].[Supplier] AS S ON P.suppliername = S.id
      where isDraft=0;
    `, (err, result) => {
      connection.release(); 
      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};

exports.purchasedraftregister = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    pool.query(`
      SELECT P.*, S.ledgername AS suppliername
      FROM [elite_pos].[dbo].[PurchaseTable_Master] AS P
      INNER JOIN [elite_pos].[dbo].[Supplier] AS S ON P.suppliername = S.id
      where isDraft=1;
    `, (err, result) => {
      connection.release(); 
      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};

exports.purchaseids = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const query = `
          SELECT 
          pt.*,
          s.ledgername as ledgername
      FROM 
          [elite_pos].[dbo].[PurchaseTable_Master] pt
      JOIN
          [elite_pos].[dbo].[supplier] s ON pt.[suppliername] = s.[id];
`;
    pool.query(query, (err, result) => {
      connection.release();
      if (err) {
        console.error('Error in fetching purchase IDs:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.header('Content-Type', 'application/json'); // Set Content-Type header
      res.json({ data: result.recordset });
    });
  });
};

exports.PurchaseId = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const query = `
    SELECT
    pt.id AS purchaseId,
    pt.purchasedate,
    pt.paymentmode,
    pt.supplierinvoicedate,
    pt.modeoftransport,
    pt.transportno,
    pt.supplierinvoiceamount,
    pt.supplierinvoiceno,
    pt.suppliername,
    pr.productId,
    pr.productName,
    pr.batchNo,
    pr.tax,
    pr.kgs,
    pr.nos,
    pr.rate,
      pr.mrp,
    pr.discMode,
    pr.discount,
    pr.amount,
    pr.cgst,
    pr.sgst,
    pr.igst,
    pr.totalAmount
FROM
    [elite_pos].[dbo].[PurchaseTable_Master] AS pt
JOIN
    [elite_pos].[dbo].[PurchaseTable_Trans] AS pr
ON
    pt.id = pr.purchaseId;
    `;
    const request = connection.request();
    request.query(query, (err, result) => {
      connection.release();
      if (err) {
        console.error('Error in fetching data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};

exports.productid = (req, res) => {
  const purchaseId = req.query.purchaseId;
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const query = `
    SELECT 
    pt.Id,
    pt.product, -- Assuming this is the product ID
    p.productname,
    dm.discMode,
    pt.batchNo,
    pt.tax,
    pt.quantity,
     pt.package,
      pt.retailQty,
       pt.retailRate,
       pt.retailMrp,
    pt.uom,
    pt.rate,
    pt.mrp,
    pt.discount,
    pt.amount,
    pt.cgst,
    pt.sgst,
    pt.igst,
    pt.totalAmount
FROM 
    [elite_pos].[dbo].[PurchaseTable_Trans] pt
JOIN
    [elite_pos].[dbo].[product] p ON pt.product = p.id
JOIN
    [elite_pos].[dbo].[discmode] dm ON pt.discMode = dm.id
WHERE 
    pt.PurchaseId = '${purchaseId}';
`;
  

    pool.query(query, (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('Query Result:', result);

      // Send the data as JSON response
      res.json({ data: result.recordset.map(row => ({ ...row, product: row.productname })) });
    });
  });
};
                 
exports.supplierstate=(req,res)=>{
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT id,state  FROM [elite_pos].[dbo].[supplier]', (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};

exports.companystate = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT state  FROM [elite_pos].[dbo].[company] where id=1', (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};

exports.getDataBySupplier = (req, res) => {
  const selectedSupplier = req.query.supplier; // Assuming the supplier is passed as a query parameter

  pool.connect((err, connection) => {
      if (err) {
          console.error('Error getting connection from pool:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      const query = `
          SELECT *
          FROM [elite_pos].[dbo].[purchase_Master]
          WHERE suppliername = @suppliername
          ORDER BY id DESC;`;

      const request = connection.request();
      request.input('suppliername', sql.VarChar, selectedSupplier);

      request.query(query, (err, result) => {
          connection.release();

          if (err) {
              console.error('Error in fetching data:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }

          // Send the data as JSON response
          res.json({ data: result.recordset });
      });
  });   
};

exports.purchase = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT *  FROM [elite_pos].[dbo].[purchase_Master]', (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};

exports.purchaseadd = async (req, res) => {
  console.log(req.body);
  const {
    purchasedate,
    paymentmode,
    supplierinvoicedate,
    modeoftransport, 
    transportno,
    supplierinvoiceamount,
    supplierinvoiceno,
    suppliername,
    pamount,
    pcgst,
    psgst,
    pigst,
    pnetAmount,    
    pcess,
    ptcs,
    pdiscMode_,
    pdiscount,
    psubtotal,
    proundOff,
    isDraft,
    products: productsString,  
  } = req.body;

  let parsedProducts = [];

  const formattedPurchaseDate = purchasedate ? purchasedate : null; 
  const formattedsupplierinvoicedate = supplierinvoicedate ? supplierinvoicedate : null;
  try {
    await poolConnect();

    parsedProducts = JSON.parse(productsString);

    const result = await pool.query`
      BEGIN TRANSACTION;
      DECLARE @purchaseId INT;
      
      INSERT INTO [elite_pos].[dbo].[PurchaseTable_Master]
      ([purchasedate], [paymentmode], [supplierinvoicedate], [modeoftransport], [transportno], [supplierinvoiceamount], [supplierinvoiceno], [suppliername],[amount],[cgst],[sgst],[igst],[netAmount],[cess],[tcs],[discMode],[discount],[subtotal],[roundoff],[isDraft])
      VALUES
      (${formattedPurchaseDate}, ${paymentmode}, ${formattedsupplierinvoicedate}, ${modeoftransport}, ${transportno}, ${supplierinvoiceamount}, ${supplierinvoiceno}, ${suppliername},${pamount},${pcgst},${psgst},${pigst},${pnetAmount},${pcess},${ptcs},${pdiscMode_},${pdiscount},${psubtotal},${proundOff},${isDraft});

      SET @purchaseId = SCOPE_IDENTITY(); -- Retrieve the SCOPE_IDENTITY() value

      COMMIT TRANSACTION;

      SELECT @purchaseId as purchaseId;
    `;
    const purchaseId = result.recordset[0].purchaseId;
    console.log('Number of products:', parsedProducts.length);
//inserting products
for (const product of parsedProducts) { // Change 'products' to 'parsedProducts'
  const { Id, productId, batchNo, tax, quantity,package,retailQty,retailRate, uom, rate,mrp,retailMrp, discMode, discount, amount, cgst, sgst, igst, totalAmount } = product;
  if (Id) {
      // Update existing product in PurchaseTable_Trans
      await pool.query`
          UPDATE [elite_pos].[dbo].[PurchaseTable_Trans]
          SET
              [product] = ${productId},
              [batchNo] = ${batchNo},
              [tax] = ${tax},
              [quantity] = ${quantity},
               [package] = ${package},
                [retailQty] = ${retailQty},
                 [retailRate] = ${retailRate},
              [uom] = ${uom},
              [rate] = ${rate},
               [mrp] = ${mrp},
                [retailMrp] = ${retailMrp},
              [discMode] = ${discMode},
              [discount] = ${discount},
              [amount] = ${amount},
              [cgst] = ${cgst},
              [sgst] = ${sgst},
              [igst] = ${igst},
              [totalAmount] = ${totalAmount}
          WHERE
              [Id] = ${Id};
      `; 
  } else {
      // Insert new product into PurchaseTable_Trans
      const insertProductResult = await pool.query`
          INSERT INTO [elite_pos].[dbo].[PurchaseTable_Trans] ([purchaseId], [product], [batchNo], [tax], [quantity],[package],[retailQty],[retailRate], [uom], [rate],[mrp],[retailMrp], [discMode], [discount], [amount], [cgst], [sgst], [igst], [totalAmount])
          VALUES (${purchaseId}, ${productId}, ${batchNo}, ${tax}, ${quantity},${package},${retailQty},${retailRate}, ${uom}, ${rate}, ${mrp},${retailMrp},${discMode}, ${discount}, ${amount}, ${cgst}, ${sgst}, ${igst}, ${totalAmount});
          
          SELECT SCOPE_IDENTITY() AS insertedId;
      `;

      const purchaseTransId = insertProductResult.recordset[0].insertedId;

      // Check if the record exists in stock_Ob
      const existingRecord = await pool.query`
          SELECT Id FROM [elite_pos].[dbo].[stock_Ob] WHERE Id = ${purchaseTransId};
      `;

      if (existingRecord.recordset.length > 0) {
          // Update existing record in stock_Ob
          await pool.query`
              UPDATE [elite_pos].[dbo].[stock_Ob]
              SET 
                  [quantity] = ${quantity},
                  [op_quantity] = ${quantity},
                  [retailQty]=${retailQty},
                  [retailRate]=${retailRate},
                  [tax] = ${tax},
                  [product] = ${productId},
                  [batchNo] = ${batchNo},
                  [rate] = ${rate},
                  [mrp]=${mrp},
                  [retailMrp]=${retailMrp},
                  [uom] = ${uom}
              WHERE [Id] = ${purchaseTransId};
          `;
      } else {
          // Insert new record into stock_Ob
          await pool.query`
              INSERT INTO [elite_pos].[dbo].[stock_Ob] (Id, product, batchNo, quantity,retailQty,retailRate, [op_quantity], tax, uom, rate,mrp,retailMrp)
              VALUES (${purchaseTransId}, ${productId}, ${batchNo}, ${quantity},${retailQty},${retailRate}, ${quantity} ,${tax}, ${uom}, ${rate},${mrp},${retailMrp});
          `;
      }
  }
}
    res.status(200).json({ success: true, message: 'Purchase added successfully' });
  } catch (error) {
    console.error('Error during purchase processing:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }

};

exports.purchaseEdit = async (req, res) => {
  const { purchaseId } = req.params;
  const { purchaseDetails, products } = req.body;
  try {
    console.log('Received request to edit purchase:', req.body); 
    await pool.query`
    UPDATE [elite_pos].[dbo].[PurchaseTable_Master]
    SET
        [purchaseDate] = ${purchaseDetails.purchaseDate},
        [paymentMode] = ${purchaseDetails.paymentMode},
        [supplierInvoiceDate] = ${purchaseDetails.supplierInvoiceDate},
        [modeOfTransport] = ${purchaseDetails.modeOfTransport},
        [transportNo] = ${purchaseDetails.transportNo},
        [supplierInvoiceAmount] = ${purchaseDetails.supplierInvoiceAmount},
        [supplierInvoiceNo] = ${purchaseDetails.supplierInvoiceNo},
        [supplierName] = ${purchaseDetails.supplierName},
        [amount] = ${purchaseDetails.pAmount},
        [cgst] = ${purchaseDetails.pCgst},
        [sgst] = ${purchaseDetails.pSgst},
        [igst] = ${purchaseDetails.pIgst},
        [netAmount] = ${purchaseDetails.pNetAmount},
        [cess] = ${purchaseDetails.pCess},
        [tcs] = ${purchaseDetails.pTcs},
        [discMode] = ${purchaseDetails.pdiscMode_},
        [discount] = ${purchaseDetails.pdiscount},
        [subtotal] = ${purchaseDetails.pSubtotal},
        [roundoff] = ${purchaseDetails.proundOff},
        [isDraft] = ${purchaseDetails.isDraft}
    WHERE
        [id] = ${purchaseDetails.id};
    `;
    for (const product of products) {
      const { Id, productId, batchNo, tax, quantity,package,retailQty,retailRate, uom, rate,mrp,retailMrp, discMode, discount, amount, cgst, sgst, igst, totalAmount } = product;
      let purchaseTransId;
      if (Id) {
        await pool.query`
          UPDATE [elite_pos].[dbo].[PurchaseTable_Trans]
          SET
              [product] = ${productId},
              [batchNo] = ${batchNo},
              [tax] = ${tax},
              [quantity] = ${quantity},
              [package] = ${package},
              [retailQty] = ${retailQty},
              [retailRate] = ${retailRate},
              [uom] = ${uom},
              [rate] = ${rate},
              [mrp] = ${mrp},
              [retailMrp]=${retailMrp},
              [discMode] = ${discMode},
              [discount] = ${discount},
              [amount] = ${amount},
              [cgst] = ${cgst},
              [sgst] = ${sgst},
              [igst] = ${igst},
              [totalAmount] = ${totalAmount}
          WHERE
              [Id] = ${Id};
        `;
        purchaseTransId = Id;
      } else {
        const insertProductResult = await pool.query`
          INSERT INTO [elite_pos].[dbo].[PurchaseTable_Trans] ([purchaseId], [product], [batchNo], [tax], [quantity],[package],[retailQty],[retailRate], [uom], [rate],[mrp],[retailMrp], [discMode], [discount], [amount], [cgst], [sgst], [igst], [totalAmount])
          VALUES (${purchaseDetails.id}, ${productId}, ${batchNo}, ${tax}, ${quantity},${package}, ${retailQty}, ${retailRate},  ${uom}, ${rate},${mrp}, ${discMode}, ${discount},${retailMrp}, ${amount}, ${cgst}, ${sgst}, ${igst}, ${totalAmount});  
          SELECT SCOPE_IDENTITY() AS insertedId;
        `;
        purchaseTransId = insertProductResult.recordset[0].insertedId;
      }
      // Use purchaseTransId for inserting into stock_Ob
      await pool.query`
        IF EXISTS (SELECT 1 FROM [elite_pos].[dbo].[stock_Ob] WHERE Id = ${purchaseTransId})
        BEGIN
          UPDATE [elite_pos].[dbo].[stock_Ob]
          SET 
            batchNo=${batchNo},
            quantity = ${quantity},
            [op_quantity]=${quantity},
            [retailQty]=${retailQty},
                  [retailRate]=${retailRate},
            tax = ${tax},
            uom = ${uom},
            rate = ${rate},
            mrp = ${mrp},
            retailMrp=${retailMrp}
          WHERE [Id] = ${purchaseTransId};
        END
        ELSE
        BEGIN
          INSERT INTO [elite_pos].[dbo].[stock_Ob] (Id, product, batchNo, quantity,retailQty,retailRate, [op_quantity], tax, uom, rate,mrp,retailMrp)
          VALUES (${purchaseTransId}, ${productId}, ${batchNo}, ${quantity},${retailQty},${retailRate} ,${quantity}, ${tax}, ${uom}, ${rate},${mrp},${retailMrp});
        END
      `;
    }
    console.log('Purchase edited successfully'); 
    res.status(200).json({ success: true, message: 'Purchase edited successfully' });
  } catch (error) {
    console.error('Error updating purchase:', error);
    res.status(400).json({ success: false, message: 'Failed to update purchase' });
  }
};

exports.purchaseDetails = async (req, res) => {
  try {
    await poolConnect();

    const result = await pool.request().execute('GetPurchaseDetails');

    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in listing data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.productname = async (req, res) => {
  try {
    await poolConnect();

    const result = await pool.request().execute('GetProductName');

 
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in listing data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.discmode = async (req, res) => {
  try {
    await poolConnect();
    const result = await pool.request().execute('GetDiscModes');
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in listing data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.suppliername = async (req, res) => {
  try {
    await poolConnect();
    const result = await pool.request().execute('GetSupplierNames');
    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in listing data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

//purchase

//contra//
exports.contraCr = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();
    const result = await pool.request().execute('GetContraCr');
    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in listing data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.contraDr = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();
    const result = await pool.request().execute('GetContraDr');
    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in listing data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.contraadd = async (req, res) => {
  console.log(req.body);
  const {
    contradate, cr, dr, billno, amount, discount, remarks
  } = req.body;
  // Handle date values
  const formattedcontraDate = contradate ? contradate : null;
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();
    const result = await pool.request()
      .input('contradate', sql.Date, formattedcontraDate)
      .input('cr', sql.VarChar(255), cr || null)
      .input('dr', sql.VarChar(255), dr || null)
      .input('billno', sql.VarChar(255), billno || null)
      .input('amount', sql.Decimal(18, 2), amount || null)
      .input('discount', sql.Decimal(18, 2), discount || null)
      .input('remarks', sql.VarChar(255), remarks || null)
      .execute('AddContra');
    console.log('Formatted contra Date:', formattedcontraDate);
    console.log('DR Value:', dr);
    console.log(result);
    // Redirect to another route after processing
    return res.redirect('/contra');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

exports.contradelete = async (req, res) => {
  const manufacturerId = req.params.id;
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();
    const result = await pool.request()
      .input('manufacturerId', sql.Int, manufacturerId)
      .execute('DeleteContra');
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Contra deleted successfully" });
    } else {
      return res.status(200).json({ success: true, message: "Contra not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.contraedit = async (req, res) => {
  const manufacturerId = req.params.id;
  const {
    contradate, cr, dr, billno, amount, discount, remarks
  } = req.body;
  // Handle date values
  const formattedcontraDate = contradate ? contradate : null;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();
    
    // Call the stored procedure to update the contra
    const result = await pool.request()
      .input('manufacturerId', sql.Int, manufacturerId)
      .input('contradate', sql.Date, formattedcontraDate)
      .input('cr', sql.VarChar(255), cr || null)  // Use VARCHAR type
      .input('dr', sql.VarChar(255), dr || null)  // Use VARCHAR type
      .input('billno', sql.VarChar(255), billno || null)
      .input('amount', sql.Decimal(18, 2), amount || null)
      .input('discount', sql.Decimal(18, 2), discount || null)
      .input('remarks', sql.VarChar(255), remarks || null)
      .execute('UpdateContra');
    
    // Check if the update operation was successful
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Contra updated successfully" });
    } else {
      // If no rows were affected, return success with appropriate message
      return res.status(200).json({ success: true, message: "Multicontra not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.contra = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();
    
    // Call the stored procedure to get contra transactions
    const result = await pool.request().execute('GetContraTransactions');
    
    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error getting contra transactions:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
/*contra*/


/*creditnotes*/
exports.creditnoteparticulars = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();
    
    // Call the stored procedure to get credit note particulars
    const result = await pool.request().execute('GetCreditNoteParticulars');
    
    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error getting credit note particulars:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.creditnoteadd = async (req, res) => {
  console.log(req.body);
  const {
    creditnotedate, Particulars, dr, cr, billno, remarks
  } = req.body;

  // Handle date values
  const formattedcreditnoteDate = creditnotedate ? creditnotedate : null;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('creditnotedate', sql.Date, formattedcreditnoteDate )
      .input('particulars', sql.NVarChar(255), Particulars || null)
      .input('dr', sql.Decimal(18, 2), dr|| null)
      .input('cr', sql.Decimal(18, 2), cr || null)
      .input('billno', sql.NVarChar(50), billno || null)
      .input('remarks', sql.NVarChar(255), remarks || null)
      .execute('AddCreditNote');

    console.log('Formatted creditnote Date:', formattedcreditnoteDate);
    console.log('DR Value:', dr);
    // ... add more log statements
    console.log(result);

    // Redirect to another route after processing
    return res.redirect('/creditnote');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

exports.creditnotedelete = async (req, res) => {
  try {
    const creditNoteId = req.params.id;
    await poolConnect();
    const result = await pool.request()
      .input('creditNoteId', sql.Int, creditNoteId)
      .execute('DeleteCreditNote');
    
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Credit note deleted successfully" });
    } else {
      return res.status(200).json({ success: true, message: "Credit note not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
 
exports.creditnoteedit = async (req, res) => {
  const manufacturerId = req.params.id;
  const {
      creditnotedate, particulars, dr, cr, billno, remarks
  } = req.body;

  // Handle date values
  const formattedcreditnoteDate = creditnotedate ? creditnotedate : null;

  try {
      // Ensure the database connection is established before proceeding
      await poolConnect();

      const request = pool.request()
          .input('manufacturerId', sql.Int, manufacturerId)
          .input('creditnoteDate', sql.Date, formattedcreditnoteDate || null)
          .input('particulars', sql.NVarChar(255), particulars || null)
          .input('dr', sql.Decimal(18, 2), dr || null)
          .input('cr', sql.Decimal(18, 2), cr || null)
          .input('billno', sql.NVarChar(50), billno || null)
          .input('remarks', sql.NVarChar(255), remarks || null);

      const result = await request.execute('UpdateCreditNote');

      // Check if the update was successful (at least one row affected)
      if (result.rowsAffected[0] > 0) {
          return res.json({ success: true, message: "Credit note updated successfully" });
      } else {
          // Handle the case where no rows were affected (e.g., credit note ID not found)
          return res.status(404).json({ success: false, error: "Credit note not found" });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.creditnote = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    // Call the stored procedure to get credit notes
    const result = await pool.request().execute('GetCreditNotes');

    // Send the data as JSON response
    return res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in getting credit notes:', error);
    return res.status(500).json({ error: 'Internal Server Error' }); 
  }
};
/*creditnotes*/

/*journals*/
exports.journalparticulars = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request().execute('GetJournalParticulars');

    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in retrieving journal particulars:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.journaladd = async (req, res) => {
  console.log(req.body);
  const {
    journaldate, particulars, dr, cr, billno, remarks
  } = req.body;

  // Handle date values
  const formattedJournalDate = journaldate || null;
  const formattedParticulars = particulars || null;
  const formattedBillNo = billno || null;
  const formattedRemarks = remarks || null;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const request = pool.request()
      .input('journaldate', sql.Date, formattedJournalDate)
      .input('particulars', sql.NVarChar(255), formattedParticulars)
      .input('billno', sql.NVarChar(50), formattedBillNo)
      .input('remarks', sql.NVarChar(255), formattedRemarks);

    // Check if dr is empty or null before adding it as an input
    if (dr !== undefined && dr !== '') {
      request.input('dr', sql.Decimal(18, 2), dr);
    } else {
      request.input('dr', sql.Decimal(18, 2), null);
    }

    // Check if cr is empty or null before adding it as an input
    if (cr !== undefined && cr !== '') {
      request.input('cr', sql.Decimal(18, 2), cr);
    } else {
      request.input('cr', sql.Decimal(18, 2), null);
    }

    const result = await request.execute('AddJournalEntry');

    console.log('Formatted journal Date:', formattedJournalDate);
    console.log('DR Value:', dr);
    // ... add more log statements
    console.log(result);

    // Redirect to another route after processing
    return res.redirect('/journal');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

exports.journaldelete = async (req, res) => {
  const manufacturerId = req.params.id;
  try {
      // Ensure the database connection is established before proceeding
      await poolConnect();
      const result = await pool.request()
          .input('manufacturerId', sql.Int, manufacturerId)
          .execute('DeleteJournalEntry');
      if (result.rowsAffected[0] > 0) {
          return res.json({ success: true, message: "Journal deleted successfully" });
      } else {
          return res.status(404).json({ success: false, error: "Journal not found" });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.journaledit = async (req, res) => {
  const manufacturerId = req.params.id;
  const {
    journaldate, particulars, dr, cr, billno, remarks
  } = req.body;

  // Parse journaldate to a date object
  const parsedJournalDate = journaldate ? new Date(journaldate) : null;

  // Format the journaldate parameter to 'YYYY-MM-DD' format if not null
  const formattedJournalDate = parsedJournalDate ? parsedJournalDate.toISOString().split('T')[0] : null;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    // Call the stored procedure to update the journal entry
    const result = await pool.request()
      .input('manufacturerId', sql.Int, manufacturerId)
      .input('journaldate', sql.Date, formattedJournalDate) // Pass the formatted journaldate
      .input('particulars', sql.NVarChar(255), particulars)
      .input('dr', sql.Decimal(18, 2), dr || null) // Pass null if dr is empty or null
      .input('cr', sql.Decimal(18, 2), cr || null) // Pass null if cr is empty or null
      .input('billno', sql.NVarChar(50), billno || null) // Pass null if billno is empty or null
      .input('remarks', sql.NVarChar(255), remarks || null) // Pass null if remarks is empty or null
      .execute('UpdateJournalEntry');

    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Journal entry updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., journal ID not found)
      return res.status(404).json({ success: false, error: "Journal entry not found" });
    }
  } catch (error) {
    console.error('Error in updating journal entry:', error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.journal = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    // Call the stored procedure to fetch journal data
    const result = await pool.request().execute('GetJournalData');

    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in fetching journal data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
/*journals*/

/*ledgerob*/
exports.ledgerData = async (req, res) => {
  const ledgerTypeDesc = req.query.ledgerTypeDesc;
  console.log('Received request for ledger data with ledgerTypeDesc:', ledgerTypeDesc);

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    // Call the stored procedure with the ledgerTypeDesc parameter
    const result = await pool.request()
      .input('ledgerTypeDesc', sql.NVarChar, ledgerTypeDesc)
      .execute('GetLedgerData');

    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in fetching ledger data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.ledgerob = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .query('EXEC [dbo].[GetLedgerTypes]');

    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in listing data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
/*ledgerob*/
//product//
exports.getcategory = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT  [Product_Category] FROM [elite_pos].[dbo].[productcategory]', (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};

exports.getuom = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .query('EXEC [dbo].[GetUOM]');

    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in listing data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.gettype = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .query('EXEC [dbo].[GetProductTypes]');

    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in listing data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getproduct = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .query('EXEC [dbo].[GetProductNames]');

    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in listing data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
//product//

/*payment*/
exports.paymentCr = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .query('EXEC [dbo].[GetPaymentCrs]');

    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in listing data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.paymentDr = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .query('EXEC [dbo].[GetPaymentDrS]');

    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in listing data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.paymentadd = async (req, res) => {
  console.log(req.body);
  const {
    paymentdate, cr, dr, billno, amount, discount, remarks
  } = req.body;

  // Handle date values
  const formattedpaymentDate = paymentdate ? paymentdate : null;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('paymentdate', sql.Date, formattedpaymentDate)
      .input('cr', sql.NVarChar(255), cr)
      .input('dr', sql.NVarChar(255), dr)
      .input('billno', sql.NVarChar(255), billno)
      .input('amount', sql.Decimal(18, 2), amount)
      .input('discount', sql.Decimal(18, 2), discount)
      .input('remarks', sql.NVarChar(255), remarks)
      .query('EXEC [dbo].[AddPayment] @paymentdate, @cr, @dr, @billno, @amount, @discount, @remarks');

    console.log('Formatted payment Date:', formattedpaymentDate);
    console.log('DR Value:', dr);
    // ... add more log statements
    console.log(result);

    // Redirect to another route after processing
    return res.redirect('/payment');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

exports.paymentdelete = async (req, res) => {
  const manufacturerId = req.params.id;
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();
    const result = await pool.request()
      .input('manufacturerId', /* Assuming your parameter type is INT */ sql.Int, manufacturerId)
      .query('EXEC [dbo].[DeletePayment] @manufacturerId');
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Payment deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "Payment not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.paymentedit = async (req, res) => {
  const manufacturerId = req.params.id;
  const {
    paymentdate, cr, dr, billno, amount, discount, remarks
  } = req.body;
  // Handle date values
  const formattedpaymentDate = paymentdate ? paymentdate : null;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();
    const result = await pool.request()
      .input('manufacturerId', /* Assuming your parameter type is INT */ sql.Int, manufacturerId)
      .input('paymentdate', sql.Date, formattedpaymentDate)
      .input('cr', sql.NVarChar(255), cr)
      .input('dr', sql.NVarChar(255), dr)
      .input('billno', sql.NVarChar(255), billno)
      .input('amount', sql.Decimal(18, 2), amount)
      .input('discount', sql.Decimal(18, 2), discount)
      .input('remarks', sql.NVarChar(sql.MAX), remarks)
      .query('EXEC [dbo].[UpdatePayment] @manufacturerId, @paymentdate, @cr, @dr, @billno, @amount, @discount, @remarks');
      
    console.log('Formatted payment Date:', formattedpaymentDate);
    console.log('DR Value:', dr);
    // ... add more log statements
    console.log(result);
    console.log(result.toString());
    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "payment updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., payment ID not found)
      return res.status(404).json({ success: false, error: "Payment not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.payment = (req, res) => {
  // Connect to the database pool
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Execute the stored procedure
    connection.query('EXEC [dbo].[GetPayments]', (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};

/*----payment----*/

/*----recipt---*/

exports.receiptadd = async (req, res) => {
  console.log(req.body);
  const {
    receiptdate, dr, cr, billno, amount, discount, remarks
  } = req.body;

  // Handle date values
  const formattedReceiptDate = receiptdate ? receiptdate : null;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    // Execute the stored procedure
    const result = await pool.request()
      .input('receiptdate', formattedReceiptDate)
      .input('dr', dr)
      .input('cr', cr)
      .input('billno', billno)
      .input('amount', amount)
      .input('discount', discount)
      .input('remarks', remarks)
      .execute('[dbo].[InsertReceipt]');

    // Log the result
    console.log(result);

    // Redirect to another route after processing
    return res.redirect('/receipt');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

exports.receiptdelete = async (req, res) => {
  const manufacturerId = req.params.id;
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    // Execute the stored procedure
    const result = await pool.request()
      .input('manufacturerId', manufacturerId)
      .execute('[dbo].[DeleteReceipt]');

    // Check if the deletion was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Receipt deleted successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., receipt ID not found)
      return res.status(404).json({ success: false, error: "Receipt not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.receiptedit = async (req, res) => {
  const manufacturerId = req.params.id;
  const {
    receiptdate, dr, cr, billno, amount, discount, remarks
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    // Execute the stored procedure
    const result = await pool.request()
      .input('manufacturerId', manufacturerId)
      .input('receiptdate', receiptdate)
      .input('dr', dr)
      .input('cr', cr)
      .input('billno', billno)
      .input('amount', amount)
      .input('discount', discount)
      .input('remarks', remarks)
      .execute('[dbo].[UpdateReceipt]');

    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Receipt updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., receipt ID not found)
      return res.status(404).json({ success: false, error: "Receipt not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.receipt = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const request = connection.request();

    // Call the stored procedure
    request.execute('[dbo].[RetrieveReceiptData]', (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error executing stored procedure:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};
    
exports.receiptCr = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const request = connection.request();

    // Call the new stored procedure
    request.execute('[dbo].[RetrieveLedgerNames]', (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error executing stored procedure:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};

exports.receiptDr = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const request = connection.request();

    // Call the stored procedure
    request.execute('[dbo].[GetCustomerLedgerNames]', (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error executing stored procedure:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};

/*------receipt------*/
/*----multipayment---*/

exports.multipaymentadd = async (req, res) => {
  console.log(req.body);
  let transaction;
  let masterId;
  try {
    await poolConnect();
    const payments = req.body.payments.payments;

    if (!Array.isArray(payments) || payments.length === 0) { 
      return res.status(400).send('Payments data is missing or not provided or not in correct format');
    }

    transaction = pool.transaction();
    await transaction.begin();

    const { payment_date, cash_bank_ledger, customer_ledger, amount } = req.body; // Extract from the main request body

    // Ensure that the required properties are not null
    if (!payment_date || !cash_bank_ledger || !customer_ledger) {
      throw new Error('One or more required properties are missing in the main request body');
    }

    const masterInsertQuery = `
      INSERT INTO [elite_pos].[dbo].[payment_Master]
      ([paymentdate], [cash/bankLedger(dr)], [ledger(dr)], [amount])
      OUTPUT inserted.id
      VALUES
      (@payment_date, @cash_bank_ledger, @customer_ledger, @amount);
    `;

    const masterInsertResult = await transaction.request()
      .input('payment_date', payment_date)
      .input('cash_bank_ledger', cash_bank_ledger)
      .input('customer_ledger', customer_ledger)
      .input('amount', amount || null) // Allow amount to be null
      .query(masterInsertQuery);

    if (masterInsertResult.recordset.length === 1) {
      masterId = masterInsertResult.recordset[0].id;
    } else {
      console.error('Error inserting record into payment_Master table');
      await transaction.rollback();
      return res.status(500).json({ success: false, message: 'Error inserting record into payment_Master table' });
    }

    for (const payment of payments) {
      const { billno, billdate, billamount, recdamount, discamount, balance } = payment;

      const transInsertQuery = `
        INSERT INTO [elite_pos].[dbo].[payment_Trans]
        ([id], [billno], [billdate], [billamount], [recdamount],[discamount], [balance])
        VALUES
        (@id, @billno, @billdate, @billamount, @recdamount, @discamount, @balance);
      `;

      await transaction.request()
        .input('id', masterId)
        .input('billno', billno)
        .input('billdate', billdate || null) // Allow billdate to be null
        .input('billamount', billamount || null) // Allow billamount to be null
        .input('recdamount', recdamount || null) // Allow recdamount to be null
        .input('discamount', discamount || null) // Allow discamount to be null
        .input('balance', balance || null) // Allow balance to be null
        .query(transInsertQuery);
    }

    await transaction.commit();
    console.log('Inserted all payments successfully');
    return res.status(200).json({ success: true, message: 'Payments added successfully' });
  } catch (error) {
    console.error('Error during payment processing:', error);
    if (transaction) {
      await transaction.rollback();
    }
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.multipaymentedit = async (req, res) => {
  try {
    await poolConnect();

    const { purchaseId, masterData, transactionData } = req.body;

    if (!purchaseId || !masterData || !transactionData || !Array.isArray(transactionData)) {
      return res.status(400).send('Invalid request format: missing or incorrect data');
    }

    const { payment_date, cash_bank_ledger, customer_ledger, amount } = masterData;

    if (!payment_date || !cash_bank_ledger || !customer_ledger) {
      throw new Error('One or more required properties are missing in the master data');
    }

    const request = pool.request();
    request.input('purchaseId', purchaseId);
    request.input('payment_date', payment_date);
    request.input('cash_bank_ledger', cash_bank_ledger);
    request.input('customer_ledger', customer_ledger);
    request.input('amount', amount || null); 
    request.input('transactionData', JSON.stringify(transactionData));

    const result = await request.execute('UpdatePaymentData');
    console.log(result.recordset[0].Message); 
    
    return res.status(200).json({ success: true, message: 'Payments updated successfully' });
  } catch (error) {
    console.error('Error during payment processing:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.multipaymentdelete = async (req, res) => {
  const id = req.params.id;
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    // Execute the stored procedure
    const result = await pool.request()
      .input('id', /* Assuming your parameter type is INT */ sql.Int, id)
      .execute('DeleteMultipayment');

    // Send the result as JSON response
    res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.multipayment = (req, res) => {
  pool.query('EXEC GetPaymentDropdownOptions', (err, result) => {
    if (err) {
      console.error('Error in listing data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Extract the result and send it as JSON response
    const options = result.recordset.map(row => ({
      value: row.id.toString(),
      label: row.label
    }));

    res.json({ options });
  });
};

function formatDate(date) {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear().toString();
  return `${day}-${month}-${year}`;
};

exports.multipaymenttransdelete = async (req, res) => {
  try {
    const transId = parseInt(req.params.transId);

    await poolConnect();
    const result = await pool.request()
      .input('transId', sql.Int, transId)
      .execute('MultiPaymentTransDelete');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, error: "Receipt transaction not found" });
    }

    return res.json({ success: true, message: "Receipt transaction deleted successfully" });
  } catch (error) {
    console.error('Error deleting transaction:', error);

    if (error instanceof sql.RequestError) {
      return res.status(500).json({ success: false, error: "Database error: " + error.message });
    } else {

      return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
};

exports.multipaymentselect = async (req, res) => {
  const { id } = req.params;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('id', sql.Int, id)
      .execute('MultiPaymentSelect');

    // Send the data as JSON response
    res.json({ masterData: result.recordsets[0], transData: result.recordsets[1] });
  } catch (error) {
    console.error('Error in fetching payment data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getPaymentCr = async (req, res) => {
  try {
    await poolConnect();

    const result = await pool.request().execute('GetPaymentCr');

    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in getting payment data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getPaymentDr = async (req, res) => {
  try {
    await poolConnect();

    const result = await pool.request().execute('GetPaymentDr');

    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in getting payment data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/*----multipayment---*/

/*----multireceipt---*/
exports.multireceiptadd = async (req, res) => {
  console.log(req.body);
  let transaction;
  let masterId;
  try {
    await poolConnect();
    const receipts = req.body.receipts.receipts;

    if (!Array.isArray(receipts) || receipts.length === 0) { 
      return res.status(400).send('Receipts data is missing or not provided or not in correct format');
    }

    transaction = pool.transaction();
    await transaction.begin();

    const { receipt_date, cash_bank_ledger, customer_ledger, amount } = req.body; // Extract from the main request body

    // Ensure that the required properties are not null
    if (!receipt_date || !cash_bank_ledger || !customer_ledger || !amount) {
      throw new Error('One or more required properties are missing in the main request body');
    }

    // Execute the stored procedure to insert data
    const result = await transaction.request()
      .input('receipt_date', receipt_date)
      .input('cash_bank_ledger', cash_bank_ledger)
      .input('customer_ledger', customer_ledger)
      .input('amount', amount)
      .input('receipts', JSON.stringify(receipts))
      .execute('InsertMultiReceipt');

    await transaction.commit();
    console.log('Inserted all receipts successfully');
    return res.status(200).json({ success: true, message: 'Receipts added successfully' });
  } catch (error) {
    console.error('Error during receipt processing:', error);
    if (transaction) {
      await transaction.rollback();
    }
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.multireceiptedit = async (req, res) => {
  try {
    const { purchaseId, masterData, transactionData } = req.body;

    if (!purchaseId || !masterData) {
      return res.status(400).send('Invalid request format: missing purchaseId or masterData');
    }

    const { receipt_date, cash_bank_ledger, customer_ledger, amount } = masterData;

    // Convert transactionData to JSON string
    const transactionDataJson = JSON.stringify(transactionData);

    // Execute the stored procedure
    const result = await pool.request()
      .input('purchaseId', sql.Int, purchaseId)
      .input('receipt_date', sql.Date, receipt_date || null) // Set to null if undefined
      .input('cash_bank_ledger', sql.NVarChar(255), cash_bank_ledger || null) // Set to null if undefined
      .input('customer_ledger', sql.NVarChar(255), customer_ledger || null) // Set to null if undefined
      .input('amount', sql.Decimal(18, 2), amount || null) // Set to null if undefined
      .input('transactionData', sql.NVarChar(sql.MAX), transactionDataJson)
      .execute('UpdateMultiReceipt');

    // Return success message
    return res.status(200).json({ success: true, message: result.recordset[0].Message });
  } catch (error) {
    console.error('Error during receipt processing:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.multireceiptdelete = async (req, res) => {
  const id = req.params.id;
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    // Execute the stored procedure to delete data from both tables
    const result = await pool.request()
      .input('id', sql.Int, id)
      .execute('DeleteMultiReceipt');

    // Check if deletion was successful
    if (result.recordset[0].Success === 1) {
      return res.json({ success: true, message: "Multireceipt deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "Multireceipt not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

exports.multireceipt = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();
    
    // Execute the stored procedure to fetch data from Recipt_Master table
    const result = await pool.request().execute('GetReceiptMasterDropdownData');

    // Extract the necessary data for the dropdown options
    const options = result.recordset.map(row => ({
      value: row.id.toString(), // Convert id to string if necessary
      label: `ID: ${row.id}, Receipt Date: ${formatDate(row.reciptdate)}, Amount: ${row.amount}, Cash/Bank Ledger: ${row['cash/bankLedger(dr)']}, Customer Ledger: ${row['customerLedger(cr)']}` // Customize this as needed
    }));

    // Send the options as JSON response
    res.json({ options });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

function formatDate(date) {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear().toString();
  return `${day}-${month}-${year}`;
}

exports.multireceipttransdelete = async (req, res) => {
  try {
    const transId = parseInt(req.params.transId); // Parse the received parameter as an integer
    
    // Check if the parsed transId is a valid number
    if (isNaN(transId)) {
      return res.status(400).json({ success: false, error: "Invalid transId parameter" });
    }

    // Ensure the database connection is established before proceeding
    await poolConnect();
    
    // Execute the stored procedure to delete from Recipt_Trans table
    const result = await pool.request()
      .input('transId', sql.Int, transId)
      .execute('DeleteReciptTransById');

    // Check if any rows were affected
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, error: "Receipt transaction not found" });
    }

    return res.json({ success: true, message: "Receipt transaction deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.multireceiptselect = async (req, res) => {
  const { id } = req.params; // Assuming the ID is passed as a route parameter

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    // Execute the first stored procedure to fetch data from Recipt_Master table
    const masterResult = await pool.request()
      .input('id', sql.Int, id)
      .execute('GetReciptMasterById');

    // Execute the second stored procedure to fetch data from Recipt_Trans table
    const transResult = await pool.request()
      .input('id', sql.Int, id)
      .execute('GetReciptTransById');

    // Send the data as JSON response
    res.json({ masterData: masterResult.recordset, transData: transResult.recordset });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getCr = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request().execute('GetLedgerNames');

    // Send the data as JSON response
    return res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getDr = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request().execute('GetCustomerLedgers');

    // Send the data as JSON response
    return res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
/*----multireceipt---*/

/*****subgroup */
exports.subgroupadd = async (req, res) => {
  const { subgroupname, parentgroup } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('subgroupname', sql.NVarChar(255), subgroupname)
      .input('parentgroup', sql.NVarChar(255), parentgroup)
      .execute('AddSubgroup');

    console.log(result);

    // Redirect to another route after processing
    return res.redirect('/subgroup');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};


exports.subgroupdelete = async (req, res) => {
  const subgroupId = req.params.id;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('subgroupId', sql.Int, subgroupId)
      .execute('DeleteSubgroup');

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Subgroup deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "Subgroup not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


exports.subgroupedit = async (req, res) => {
  const subgroupId = req.params.id;

  // Extract the subgroup data from the request body
  const {
    subgroupname, parentgroup
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('subgroupId', sql.Int, subgroupId)
      .input('subgroupname', sql.NVarChar(255), subgroupname)
      .input('parentgroup', sql.NVarChar(255), parentgroup)
      .execute('UpdateSubgroup');

    console.log(result);
    console.log(result.toString());

    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Subgroup updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., subgroup ID not found)
      return res.status(404).json({ success: false, error: "Subgroup not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


exports.subgroup = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request().execute('GetSubgroups');

    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in fetching subgroups:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


/*****subgroup */



/* ---ledger----*/
exports.ledgeradd = async (req, res) => {
  const {
    code, ledgername, group, subgroup, paymentlimit, openingdate, dramount, cramount, active
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('code', sql.NVarChar(50), code || null)
      .input('ledgername', sql.NVarChar(255), ledgername || null)
      .input('group', sql.NVarChar(255), group || null)
      .input('subgroup', sql.NVarChar(255), subgroup || null)
      .input('paymentlimit', sql.Decimal(18, 2), paymentlimit || null)
      .input('openingdate', sql.Date, openingdate || null)
      .input('dramount', sql.Decimal(18, 2), dramount || null)
      .input('cramount', sql.Decimal(18, 2), cramount || null)
      .input('active', sql.Bit, active || null)
      .execute('AddLedger');

    console.log('Database Insert Result:', JSON.stringify(result, null, 2));
    return res.redirect('/ledger');
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};



exports.ledgerdelete = async (req, res) => {
  const ledgerId = req.params.id;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('ledgerId', sql.Int, ledgerId)
      .execute('DeleteLedger');

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Ledger deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "Ledger not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


exports.ledgeredit = async (req, res) => {
  const ledgerId = req.params.id;

  // Extract ledger data from the request body
  const {
    code, ledgername, group, subgroup, paymentlimit, openingdate, dramount, cramount, active
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    // Execute the stored procedure to update the ledger
    const result = await pool.request()
      .input('ledgerId', sql.Int, ledgerId)
      .input('code', sql.NVarChar(50), code || null)
      .input('ledgername', sql.NVarChar(255), ledgername || null)
      .input('group', sql.NVarChar(255), group || null)
      .input('subgroup', sql.NVarChar(255), subgroup || null)
      .input('paymentlimit', sql.Decimal(18, 2), paymentlimit || null)
      .input('openingdate', sql.Date, openingdate || null)
      .input('dramount', sql.Decimal(18, 2), dramount || null)
      .input('cramount', sql.Decimal(18, 2), cramount || null)
      .input('active', sql.Bit, active || null)
      .execute('UpdateLedger');

    // Check the return value to determine the outcome of the operation
    if (result.returnValue === 0) {
      return res.json({ success: true, message: "Ledger updated successfully" });
    } else if (result.returnValue === 1) {
      return res.status(404).json({ success: false, error: "Ledger not found" });
    } else {
      // Handle unexpected errors
      console.error("Unexpected error occurred:", result);
      return res.status(500).json({ success: false, error: "An unexpected error occurred" });
    }
  } catch (error) {
    console.error("Error updating ledger:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};



exports.ledger = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request().execute('GetLedger');

    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in listing data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


/* ---ledger----*/


/* ---salesman----*/
exports.salesmanadd = async (req, res) => {
  const {
    code, ledgername, mobile, aadhar, email, openingdate, address, city, state,
    pincode
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const request = pool.request();

    // Add input parameters, setting them to null if the corresponding values are null
    request.input('code', sql.NVarChar(50), code || null);
    request.input('ledgername', sql.NVarChar(100), ledgername || null);
    request.input('mobile', sql.NVarChar(20), mobile || null);
    request.input('aadhar', sql.NVarChar(20), aadhar || null);
    request.input('email', sql.NVarChar(100), email || null);
    request.input('openingdate', sql.Date, openingdate || null);
    request.input('address', sql.NVarChar(255), address || null);
    request.input('city', sql.NVarChar(100), city || null);
    request.input('state', sql.NVarChar(100), state || null);
    request.input('pincode', sql.NVarChar(10), pincode || null);

    const result = await request.execute('AddSalesman');

    console.log(result);

    // Redirect to another route after processing
    return res.redirect('/salesman');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};



exports.salesmandelete = async (req, res) => {
  const salesmanId = req.params.id;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('salesmanId', sql.Int, salesmanId)
      .execute('DeleteSalesman');

    console.log(result);

    // Check if the delete was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "salesmanId deleted successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., salesman ID not found)
      return res.status(404).json({ success: false, error: "salesmanId not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


exports.salesmanedit = async (req, res) => {
  const customerId = req.params.id;

  // Extract the customer data from the request body
  const {
    code, ledgername, mobile, aadhar, email, openingdate, address, city, state,
    pincode
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('customerId', sql.Int, customerId)
      .input('code', sql.VarChar(50), code)
      .input('ledgername', sql.VarChar(100), ledgername)
      .input('mobile', sql.VarChar(20), mobile)
      .input('aadhar', sql.VarChar(20), aadhar)
      .input('email', sql.VarChar(100), email)
      .input('openingdate', sql.Date, openingdate)
      .input('address', sql.NVarChar(255), address)
      .input('city', sql.NVarChar(100), city)
      .input('state', sql.NVarChar(100), state)
      .input('pincode', sql.VarChar(20), pincode)
      .execute('UpdateSalesman');

    console.log(result);
    console.log(result.toString());

    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "salesman updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., salesman ID not found)
      return res.status(404).json({ success: false, error: "salesman not found" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


exports.salesman = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request().execute('GetSalesmen');

    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in listing data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/* ---salesman----*/

/*****product */
exports.stockobadd = async (req, res) => {
  console.log(req.body);

  const {
    productname, batchno, batchexpiry, purcrate, mrp, optQty
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[stockob]
      (productname,batchno,batchexpiry,purcrate,mrp,optQty)
      VALUES
      ( ${productname}, ${batchno}, ${batchexpiry}, ${purcrate},  ${mrp} ,${optQty})
    `;
    console.log(result);
    console.log(result.toString());


    // Redirect to another route after processing
    return res.redirect('/stockob');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

exports.stockobdelete = async (req, res) => {
  const stockobId = req.params.id;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('stockobId', /* Assuming your parameter type is INT */ sql.Int, stockobId)
      .query('DELETE FROM [elite_pos].[dbo].[stockob] WHERE id = @stockobId');

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "stockobId deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "stockobId not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.stockobedit = async (req, res) => {
  const stockobId = req.params.id;

  // Extract the product data from the request body
  const {
    productname, batchno, batchexpiry, purcrate, mrp, optQty
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[stockob]
      SET
      productname = ${productname},
      batchno = ${batchno},
      batchexpiry = ${batchexpiry},
      purcrate = ${purcrate},
      mrp = ${mrp},
      optQty = ${optQty}
      WHERE
        id = ${stockobId}
    `;

    console.log(result);
    console.log(result.toString());

    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "stockob updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., product ID not found)
      return res.status(404).json({ success: false, error: "Product not found" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.stockob = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request().execute('GetStockOB');

    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in listing data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



/*****stockob */

/*****UOM */

exports.uomadd = async (req, res) => {
  const {
    unitname, shortname, baseunit, baseqty, complexunit
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('unitname', sql.NVarChar(100), unitname || null)
      .input('shortname', sql.NVarChar(50), shortname || null)
      .input('baseunit', sql.NVarChar(50), baseunit || null)
      .input('baseqty', sql.Decimal(18, 2), baseqty || null)
      .input('complexunit', sql.NVarChar(50), complexunit || null)
      .execute('AddUOM');

    console.log(result);
    console.log(result.toString());

    // Redirect to another route after processing
    return res.redirect('/uom');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};



exports.uomdelete = async (req, res) => {
  const uomId = req.params.id;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('uomId', /* Assuming your parameter type is INT */ sql.Int, uomId)
      .execute('DeleteUOM');

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "uomId deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "uomId not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


exports.uomedit = async (req, res) => {
  const uomId = req.params.id;

  // Extract the product data from the request body
  const {
    unitname, shortname, baseunit, baseqty, complexunit
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[uom]
      SET
      unitname = ${unitname},
      shortname = ${shortname},
      baseunit=${baseunit},
      baseqty=${baseqty},
      complexunit=${complexunit}
      WHERE
        id = ${uomId}
    `;

    console.log(result);
    console.log(result.toString());

    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "uomId Type updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., product ID not found)
      return res.status(404).json({ success: false, error: "uomId not found" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.uom = (req, res) => {
  pool.connect((err, connection) => {
      if (err) {
          console.error('Error getting connection from pool:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      connection.query('EXEC GetUOMs', (err, result) => {
          connection.release(); // Release the connection back to the pool

          if (err) {
              console.error('Error in listing data:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }

          // Send the data as JSON response
          res.json({ data: result.recordset });
      });
  });
};


/*****UOM */

// Assuming you have the necessary imports and setup for the database connection

exports.color = async (req, res) => {
  const userId = req.params.id;
  const { mode } = req.body;

  try {
    // Connect to the database (replace this with your actual database connection logic)

    // Update the user's preferences in the database
    const result = await pool.query`
      UPDATE users
      SET mode = ${mode}
      WHERE id = ${userId}
    `;

    console.log(result);

    // Check if the update was successful
    if (result.returnValue !== undefined && result.returnValue > 0) {
      return res.json({ success: true, message: "Mode updated successfully", mode: mode });
    } else {
      return res.status(404).json({ success: false, error: "User not found" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

/*****productcategory */

exports.productcategoryadd = async (req, res) => {
  console.log(req.body);

  const {
      categorycode, productcategory, active
  } = req.body;

  try {
      // Ensure the database connection is established before proceeding
      await poolConnect();

      const result = await pool.request()
          .input('CategoryCode', sql.VarChar(50), categorycode)
          .input('ProductCategory', sql.VarChar(100), productcategory)
          .input('Active', sql.Bit, active)
          .execute('AddProductCategory');

      console.log(result);
      console.log(result.toString());

      // Redirect to another route after processing
      return res.redirect('/productCategory');
  } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
  }
};

exports.productcategorydelete = async (req, res) => {
  const CategoryId = req.params.id;

  try {
      // Ensure the database connection is established before proceeding
      await poolConnect();

      const result = await pool.request()
          .input('CategoryId', sql.Int, CategoryId)
          .execute('DeleteProductCategory');

      if (result.rowsAffected[0] > 0) {
          return res.json({ success: true, message: "Product category deleted successfully" });
      } else {
          return res.status(404).json({ success: false, error: "Product category not found" });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


exports.productcategoryedit = async (req, res) => {
  const productcategoryId = req.params.id;

  // Extract the product category data from the request body
  const {
    categorycode, productcategory, active
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const request = pool.request()
      .input('productcategoryId', sql.Int, productcategoryId)
      .input('categorycode', sql.VarChar(50), categorycode || null) // Allow null value for categorycode
      .input('productcategory', sql.VarChar(100), productcategory || null) // Allow null value for productcategory
      .input('active', sql.Bit, active || null); // Allow null value for active

    const result = await request.execute('UpdateProductCategoryProcedure');

    console.log(result);
    console.log(result.toString());

    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Product Category updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., product category ID not found)
      return res.status(404).json({ success: false, error: "Product Category not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


exports.productcategory = (req, res) => {
  // Connect to the database
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Execute the stored procedure to get product categories
    const request = new sql.Request(connection);
    request.execute('GetProductCategoriesProcedure', (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};


/*****productcategory */



/*****producttype */

exports.producttypeadd = async (req, res) => {
  console.log(req.body);

  const {
    typecode, producttype
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[producttype]
      (typecode, producttype)
      VALUES
      ( ${typecode}, ${producttype})
    `;
    console.log(result);
    console.log(result.toString());


    // Redirect to another route after processing
    return res.redirect('/producttype');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

exports.producttypedelete = async (req, res) => {
  const producttypeId = req.params.id;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('producttypeId', /* Assuming your parameter type is INT */ sql.Int, producttypeId)
      .query('DELETE FROM [elite_pos].[dbo].[producttype] WHERE id = @producttypeId');

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "product deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "productId not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.producttypeedit = async (req, res) => {
  const productId = req.params.id;

  // Extract the product data from the request body
  const {
    typecode, producttype
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[producttype]
      SET
      typecode = ${typecode},
      producttype = ${producttype}
      WHERE
        id = ${productId}
    `;

    console.log(result);
    console.log(result.toString());

    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Product Type updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., product ID not found)
      return res.status(404).json({ success: false, error: "Product not found" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.producttype = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT *  FROM [elite_pos].[dbo].[producttype]', (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};

/*****producttype */


/*****product */

exports.productadd = async (req, res) => {
  console.log(req.body);

  const {
    code, productname, description, hsnCode, category, productType, uom, tax, active,manufacturer,combination,package
  } = req.body;

  // Function to convert empty strings to null
  const convertToNull = (value) => (value === '' ? null : value);

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('code', sql.VarChar(50), convertToNull(code))
      .input('productname', sql.VarChar(100), convertToNull(productname))
      .input('description', sql.NVarChar, convertToNull(description))
      .input('hsnCode', sql.VarChar(50), convertToNull(hsnCode))
      .input('category', sql.VarChar(50), convertToNull(category))
      .input('productType', sql.VarChar(50), convertToNull(productType))
      .input('manufacturer', sql.VarChar(50), convertToNull(manufacturer))
      .input('combination', sql.VarChar(50), convertToNull(combination))
      .input('package', sql.VarChar(50), convertToNull(package))
      .input('uom', sql.VarChar(50), convertToNull(uom))
      .input('tax', sql.Decimal(18, 2), tax !== '' ? tax : null) // Convert empty tax to null
      .input('active', sql.Bit, active) // No need to convert active to null
      .execute('InsertProduct');

    console.log(result);
    console.log(result.toString());

    // Redirect to another route after processing
    return res.redirect('/product');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

exports.productdelete = async (req, res) => {
  const productId = req.params.id;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('productId', sql.Int, productId)
      .execute('DeleteProductProcedure');

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Product deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "Product ID not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.productedit = async (req, res) => {
  const productId = req.params.id;

  // Extract the product data from the request body
  const {
    code, productname, description, hsnCode, category, productType, uom, tax, active,manufacturer,combination,package
  } = req.body;

  // Function to convert empty strings to null
  const convertToNull = (value) => (value === '' ? null : value);

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('productId', sql.Int, productId)
      .input('code', sql.VarChar(50), convertToNull(code))
      .input('productname', sql.VarChar(100), convertToNull(productname))
      .input('description', sql.NVarChar, convertToNull(description))
      .input('hsnCode', sql.VarChar(50), convertToNull(hsnCode))
      .input('category', sql.VarChar(50), convertToNull(category))
      .input('productType', sql.VarChar(50), convertToNull(productType))
      .input('manufacturer', sql.VarChar(50), convertToNull(manufacturer))
      .input('combination', sql.VarChar(50), convertToNull(combination))
      .input('package', sql.VarChar(50), convertToNull(package))
      .input('uom', sql.VarChar(50), convertToNull(uom))
      .input('tax', sql.Decimal(18, 2), tax !== '' ? tax : null) // Convert empty tax to null
      .input('active', sql.Bit, active)
      .execute('UpdateProduct');

    console.log(result);
    console.log(result.toString());

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Product updated successfully" });
    } else {
      // The update operation was successful, but no rows were affected
      // Return a 200 status code to indicate success
      return res.status(200).json({ success: true, message: "Product updated successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.product = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request().execute('GetProducts');

    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in listing data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/*****product */

/*****customerdisc */

exports.customerdiscadd = async (req, res) => {
  const {
    customername, products, disc, discmoney
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('customername', sql.NVarChar(100), customername)
      .input('products', sql.NVarChar(100), products)
      .input('disc', sql.Decimal(18, 2), disc)
      .input('discmoney', sql.Decimal(18, 2), discmoney)
      .execute('AddCustomerDiscount');

    // Redirect to another route after processing
    return res.redirect('/customerdisc');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};


exports.customerdiscdelete = async (req, res) => {
  const customerdiscId = req.params.id;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('customerdiscId', sql.Int, customerdiscId)
      .execute('DeleteCustomerDiscount');

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Customer discount deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "Customer discount not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


exports.customerdiscedit = async (req, res) => {
  const customerdiscId = req.params.id;

  // Extract the customer data from the request body
  const {
    customername, products, disc, discmoney
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('customerdiscId', sql.Int, customerdiscId)
      .input('customername', sql.VarChar(100), customername)
      .input('products', sql.VarChar(255), products)
      .input('disc', sql.Decimal(18, 2), disc)
      .input('discmoney', sql.Decimal(18, 2), discmoney)
      .execute('UpdateCustomerDiscount');

    console.log(result);
    console.log(result.toString());

    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Customer discount updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., customer discount ID not found)
      return res.status(404).json({ success: false, error: "Customer discount not found" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


exports.customerdisc = async (req, res) => {
  try {
    await poolConnect();

    const result = await pool.request().execute('GetCustomerDiscounts');

    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error in listing data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


/*****customerdisc */

/*----manufacturer---*/
exports.manufactureradd = async (req, res) => {
  console.log(req.body);
  
  // Function to convert empty strings to null
  const convertToNull = (value) => (value === '' ? null : value);

  const {
    code, manufacturername, contactNo, gstin, address, city, state,
    pincode
  } = req.body;

  try {
    await poolConnect();

    const result = await pool.request()
      .input('code', sql.VarChar(50), convertToNull(code))
      .input('manufacturername', sql.VarChar(100), convertToNull(manufacturername))
      .input('contactNo', sql.VarChar(20), convertToNull(contactNo))
      .input('gstin', sql.VarChar(50), convertToNull(gstin))
      .input('address', sql.NVarChar, convertToNull(address))
      .input('city', sql.VarChar(50), convertToNull(city))
      .input('state', sql.VarChar(50), convertToNull(state))
      .input('pincode', sql.VarChar(20), convertToNull(pincode))
      .execute('AddManufacturerProcedure');

    console.log(result);
    console.log(result.toString());

    return res.redirect('/manufacturer');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

exports.manufacturerdelete = async (req, res) => {
  const manufacturerId = req.params.id;
  try {
    // Establish a connection to the database
    await poolConnect();

    // Execute the stored procedure to delete the manufacturer
    const result = await pool.request()
      .input('manufacturerId', sql.Int, manufacturerId)
      .execute('DeleteManufacturer');

      if (result.rowsAffected[0] > 0) {
        return res.json({ success: true, message: "Manufacturer updated successfully" });
    } else {
        // The update operation was successful, but no rows were affected
        // Return a 200 status code to indicate success
        return res.status(200).json({ success: true, message: "Manufacturer updated successfully" });
    }
  } catch (error) {
    // Log any errors that occur during the process
    console.error(error);
    // Return internal server error response
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.manufactureredit = async (req, res) => {
  const manufacturerId = req.params.id;

  const {
      code, manufacturername, contactNo, gstin, address, city, state,
      pincode
  } = req.body;

  try {
      await poolConnect();

      const result = await pool.request()
          .input('manufacturerId', sql.Int, manufacturerId)
          .input('code', sql.VarChar(50), code || null)
          .input('manufacturername', sql.VarChar(100), manufacturername || null)
          .input('contactNo', sql.VarChar(20), contactNo || null)
          .input('gstin', sql.VarChar(50), gstin || null)
          .input('address', sql.NVarChar, address || null)
          .input('city', sql.VarChar(50), city || null)
          .input('state', sql.VarChar(50), state || null)
          .input('pincode', sql.VarChar(20), pincode || null)
          .execute('UpdateManufacturer');

      console.log(result);
      console.log(result.toString());

      if (result.rowsAffected[0] > 0) {
          return res.json({ success: true, message: "Manufacturer updated successfully" });
      } else {
          return res.status(200).json({ success: true, message: "Manufacturer updated successfully" });
      }
  } catch (error) {
      console.error(error.message); // Log the error message
      return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.manufacturer = async (req, res) => {
  try {
      await poolConnect();

      const result = await pool.request().execute('GetManufacturers');

      console.log(result);
      console.log(result.recordset);
      
      return res.json({ data: result.recordset });
  } catch (error) {
      console.error('Error in listing data:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/*----manufacturer---*/

/* ---customer----*/

exports.customeradd = async (req, res) => {
  console.log(req.body);

  const {
      code, ledgername, subgroup, gstin, pan, contactPerson, mobile, phone, email,
      creditday, creditlimit, allowdisc, disc, pmtmode, address, city, state,
      location, pincode, beneficeiryname, acctnumber, ifsc, bankname, bankbranch, bankphone, openingdate,
      dramount, cramount, active
  } = req.body;

  try {
      await poolConnect();

      // Convert empty strings to null
      const creditdayValue = creditday === '' ? null : creditday;
      const allowdiscValue = allowdisc === '' ? null : allowdisc;

      const result = await pool.request()
          .input('code', sql.VarChar(255), code || null)
          .input('ledgername', sql.VarChar(255), ledgername || null)
          .input('subgroup', sql.VarChar(255), subgroup || null)
          .input('gstin', sql.VarChar(255), gstin || null)
          .input('pan', sql.VarChar(255), pan || null)
          .input('contactPerson', sql.VarChar(255), contactPerson || null)
          .input('mobile', sql.VarChar(255), mobile || null)
          .input('phone', sql.VarChar(255), phone || null)
          .input('email', sql.VarChar(255), email || null)
          .input('creditday', sql.VarChar(255), creditdayValue)
          .input('creditlimit', sql.Decimal(18, 2), creditlimit || null)
          .input('allowdisc', sql.VarChar(255), allowdiscValue)
          .input('disc', sql.Decimal(18, 2), disc || null)
          .input('pmtmode', sql.VarChar(255), pmtmode || null)
          .input('address', sql.NVarChar, address || null)
          .input('city', sql.VarChar(255), city || null)
          .input('state', sql.VarChar(255), state || null)
          .input('location', sql.VarChar(255), location || null)
          .input('pincode', sql.VarChar(255), pincode || null)
          .input('beneficeiryname', sql.VarChar(255), beneficeiryname || null)
          .input('acctnumber', sql.VarChar(255), acctnumber || null)
          .input('ifsc', sql.VarChar(255), ifsc || null)
          .input('bankname', sql.VarChar(255), bankname || null)
          .input('bankbranch', sql.VarChar(255), bankbranch || null)
          .input('bankphone', sql.VarChar(255), bankphone || null)
          .input('openingdate', sql.Date, openingdate || null)
          .input('dramount', sql.Decimal(18, 2), dramount || null)
          .input('cramount', sql.Decimal(18, 2), cramount || null)
          .input('active', sql.Bit, active || null)
          .execute('AddCustomerProcedure');

      console.log(result);
      console.log(result.toString());
      return res.redirect('/customer');
  } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
  }
};

exports.customerdelete = async (req, res) => {
  const customerId = req.params.id;
  try {
      await poolConnect();

      const result = await pool.request()
          .input('customerId', sql.Int, customerId)
          .execute('DeleteCustomerProcedure');

      if (result.rowsAffected[0] > 0) {
          return res.json({ success: true, message: "Customer deleted successfully" });
      } else {
          return res.status(404).json({ success: false, error: "Customer not found" });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.customeredit = async (req, res) => {
  const customerId = req.params.id;
  const {
      code, ledgername, subgroup, gstin, pan, contactPerson, mobile, phone, email,
      creditday, creditlimit, allowdisc, disc, pmtmode, address, city, state,
      location, pincode, beneficeiryname, acctnumber, ifsc, bankname, bankbranch, bankphone, openingdate,
      dramount, cramount, active
  } = req.body;
  
  // Convert empty strings to null
  const convertToNull = (value) => (value === '' ? null : value);

  try {
      await poolConnect();

      const result = await pool.request()
          .input('CustomerId', sql.Int, customerId)
          .input('Code', sql.VarChar(50), convertToNull(code))
          .input('LedgerName', sql.VarChar(100), convertToNull(ledgername))
          .input('Subgroup', sql.VarChar(100), convertToNull(subgroup))
          .input('Gstin', sql.VarChar(50), convertToNull(gstin))
          .input('Pan', sql.VarChar(50), convertToNull(pan))
          .input('ContactPerson', sql.VarChar(100), convertToNull(contactPerson))
          .input('Mobile', sql.VarChar(20), convertToNull(mobile))
          .input('Phone', sql.VarChar(20), convertToNull(phone))
          .input('Email', sql.VarChar(100), convertToNull(email))
          .input('CreditDay', sql.Int, creditday)
          .input('CreditLimit', sql.Decimal(18, 2), convertToNull(creditlimit))
          .input('AllowDisc', sql.Bit, allowdisc)
          .input('Disc', sql.Decimal(18, 2), convertToNull(disc))
          .input('PmtMode', sql.VarChar(50), convertToNull(pmtmode))
          .input('Address', sql.NVarChar, convertToNull(address))
          .input('City', sql.NVarChar, convertToNull(city))
          .input('State', sql.NVarChar, convertToNull(state))
          .input('Location', sql.NVarChar, convertToNull(location))
          .input('Pincode', sql.NVarChar, convertToNull(pincode))
          .input('BeneficeiryName', sql.NVarChar, convertToNull(beneficeiryname))
          .input('AcctNumber', sql.NVarChar, convertToNull(acctnumber))
          .input('Ifsc', sql.NVarChar, convertToNull(ifsc))
          .input('BankName', sql.NVarChar, convertToNull(bankname))
          .input('BankBranch', sql.NVarChar, convertToNull(bankbranch))
          .input('BankPhone', sql.NVarChar, convertToNull(bankphone))
          .input('OpeningDate', sql.Date, convertToNull(openingdate))
          .input('DRAmount', sql.Decimal(18, 2), convertToNull(dramount))
          .input('CRAmount', sql.Decimal(18, 2), convertToNull(cramount))
          .input('Active', sql.Bit, active)
          .execute('UpdateCustomerProcedure');

      console.log(result);
      console.log(result.toString());
      if (result.rowsAffected[0] > 0) {
          return res.json({ success: true, message: "Customer updated successfully" });
      } else {
          return res.status(404).json({ success: false, error: "Customer not found" });
      }

  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.customer = async (req, res) => {
  try {
      await poolConnect();

      const result = await pool.request().execute('GetCustomerData');

      if (result.recordset.length > 0) {
          return res.json({ data: result.recordset });
      } else {
          return res.status(404).json({ error: 'No data found' });
      }
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/* ---customer----*/

exports.city = async (req, res) => {
  try {
      await poolConnect();

      const result = await pool.request().execute('GetCityData');

      console.log(result);

      if (result.recordset.length > 0) {
          return res.json({ data: result.recordset });
      } else {
          return res.status(404).json({ error: 'No data found' });
      }
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/* ---supplier----*/

exports.supplieradd = async (req, res) => {
  console.log(req.body);

  const {
      code, ledgername, subgroup, gstin, pan, contactPerson, mobile, phone, email,
      allowdisc, disc, pmtmode, paymentlimit, address, city, state,
      location, pincode, beneficeiryname, acctnumber, ifsc, bankname, bankbranch, bankphone, openingdate,
      dramount, cramount, active
  } = req.body;

  try {
      await poolConnect();

      const result = await pool.request()
          .input('Code', sql.NVarChar, code)
          .input('LedgerName', sql.NVarChar, ledgername)
          .input('Subgroup', sql.NVarChar, subgroup)
          .input('GSTIN', sql.NVarChar, gstin)
          .input('PAN', sql.NVarChar, pan)
          .input('ContactPerson', sql.NVarChar, contactPerson)
          .input('Mobile', sql.NVarChar, mobile)
          .input('Phone', sql.NVarChar, phone)
          .input('Email', sql.NVarChar, email)
          .input('AllowDisc', sql.Bit, allowdisc)
          .input('Disc', sql.Decimal(18, 2), disc === '' ? null : disc)
          .input('PmtMode', sql.NVarChar, pmtmode)
          .input('PaymentLimit', sql.Decimal(18, 2), paymentlimit === '' ? null : paymentlimit)
          .input('Address', sql.NVarChar, address)
          .input('City', sql.NVarChar, city)
          .input('State', sql.NVarChar, state)
          .input('Location', sql.NVarChar, location)
          .input('Pincode', sql.NVarChar, pincode)
          .input('BeneficeiryName', sql.NVarChar, beneficeiryname)
          .input('AcctNumber', sql.NVarChar, acctnumber)
          .input('IFSC', sql.NVarChar, ifsc)
          .input('BankName', sql.NVarChar, bankname)
          .input('BankBranch', sql.NVarChar, bankbranch)
          .input('BankPhone', sql.NVarChar, bankphone)
          .input('OpeningDate', sql.Date, openingdate === '' ? null : openingdate)
          .input('DRAmount', sql.Decimal(18, 2), dramount === '' ? null : dramount)
          .input('CRAmount', sql.Decimal(18, 2), cramount === '' ? null : cramount)
          .input('Active', sql.Bit, active)
          .execute('AddSupplierProcedure');

      console.log(result);
      console.log(result.toString());
      return res.redirect('/supplier');
  } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
  }
};

exports.supplierdelete = async (req, res) => {
    const supplierId = req.params.id;
    try {
        await poolConnect();

        const result = await pool.request()
            .input('supplierId', sql.Int, supplierId)
            .execute('DeleteSupplierProcedure');

        if (result.rowsAffected[0] > 0) {
            return res.json({ success: true, message: "Supplier deleted successfully" });
        } else {
            return res.status(404).json({ success: false, error: "Supplier not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

exports.supplieredit = async (req, res) => {
  const supplierId = req.params.id;
  const {
      code, ledgername, subgroup, gstin, pan, contactPerson, mobile, phone, email,
      allowdisc, disc, pmtmode, paymentlimit, address, city, state,
      location, pincode, beneficeiryname, acctnumber, ifsc, bankname, bankbranch, bankphone, openingdate,
      dramount, cramount, active
  } = req.body;

  try {
      await poolConnect();

      const result = await pool.request()
          .input('SupplierId', sql.Int, supplierId)
          .input('Code', sql.VarChar(50), code || null)
          .input('LedgerName', sql.VarChar(100), ledgername || null)
          .input('Subgroup', sql.VarChar(100), subgroup || null)
          .input('Gstin', sql.VarChar(50), gstin || null)
          .input('Pan', sql.VarChar(50), pan || null)
          .input('ContactPerson', sql.VarChar(100), contactPerson || null)
          .input('Mobile', sql.VarChar(20), mobile || null)
          .input('Phone', sql.VarChar(20), phone || null)
          .input('Email', sql.VarChar(100), email || null)
          .input('AllowDisc', sql.Bit, allowdisc)
          .input('Disc', sql.Decimal(18, 2), disc || null)
          .input('PmtMode', sql.VarChar(50), pmtmode || null)
          .input('PaymentLimit', sql.Decimal(18, 2), paymentlimit || null)
          .input('Address', sql.NVarChar, address || null)
          .input('City', sql.NVarChar, city || null)
          .input('State', sql.NVarChar, state || null)
          .input('Location', sql.NVarChar, location || null)
          .input('Pincode', sql.NVarChar, pincode || null)
          .input('BeneficeiryName', sql.NVarChar, beneficeiryname || null)
          .input('AcctNumber', sql.NVarChar, acctnumber || null)
          .input('Ifsc', sql.NVarChar, ifsc || null)
          .input('BankName', sql.NVarChar, bankname || null)
          .input('BankBranch', sql.NVarChar, bankbranch || null)
          .input('BankPhone', sql.NVarChar, bankphone || null)
          .input('OpeningDate', sql.Date, openingdate || null)
          .input('DRAmount', sql.Decimal(18, 2), dramount || null)
          .input('CRAmount', sql.Decimal(18, 2), cramount || null)
          .input('Active', sql.Bit, active)
          .execute('UpdateSupplierProcedure');

      console.log(result);

      if (result.rowsAffected[0] > 0) {
          return res.json({ success: true, message: "Supplier updated successfully" });
      } else {
          return res.status(404).json({ success: false, error: "Supplier not found" });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.supplier = async (req, res) => {
  try {
    await poolConnect();

    const result = await pool.request()
      .execute('GetSupplierProcedure');

    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error fetching supplier data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/* ---supplier----*/

/*user*/

exports.user = async (req, res) => {
  try {
    await poolConnect();

    const result = await pool.request()
      .execute('GetUserProcedure');

    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id, username, email, roleId, password } = req.body;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user details in the database using parameterized query
    const query = `
      UPDATE [elite_pos].[dbo].[registeration] 
      SET [userid] = @username, [emailid] = @email, [role] = @roleId, [password] = @hashedPassword
      WHERE [id] = @id
    `;

    await pool.request()
      .input('id', sql.Int, id)
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .input('roleId', sql.Int, roleId)
      .input('hashedPassword', sql.NVarChar, hashedPassword)
      .query(query);

    // Send success response
    res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'An error occurred while updating the user. Please try again.' });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id; // Assuming userId is passed as a parameter
  try {
    await poolConnect();

    const result = await pool.request()
      .input('UserId', sql.Int, userId)
      .execute('DeleteUserProcedure');

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "User deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.create = (req, res) => {
  // Extract data from request body
  const { username, password, email, role } = req.body;

  // Check if all required fields are present
  if (!username || !password || !email || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Connect to the database
  sql.connect(config, (err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    try {
      // Create a new request object
      const request = new sql.Request();

      // Check if the email already exists
      const checkEmailQuery = `SELECT COUNT(*) AS count FROM [elite_pos].[dbo].[registeration] WHERE emailid = @email`;

      request.input('email', sql.NVarChar, email);

      request.query(checkEmailQuery, (err, result) => {
        if (err) {
          console.error('Error executing query:', err);
          sql.close(); // Close the database connection
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        const count = result.recordset[0].count;

        if (count > 0) {
          // Email already exists, send notification
          return res.status(400).json({ error: 'Email already exists' });
        }

        // Email does not exist, proceed with user creation
        // Hash the password using bcrypt
        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
          if (hashErr) {
            console.error('Error hashing password:', hashErr);
            sql.close(); // Close the database connection
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          // Insert the user into the database
          const insertQuery = `INSERT INTO [elite_pos].[dbo].[registeration] (userid, emailid, password, role) 
                               VALUES (@username, @email, @password, @role)`;

          // Bind parameters to the query
          request.input('username', sql.NVarChar, username);
          request.input('password', sql.NVarChar, hashedPassword); // Use hashed password
          request.input('role', sql.NVarChar, role);

          // Execute the insert query
          request.query(insertQuery, (insertErr, insertResult) => {
            if (insertErr) {
              console.error('Error executing insert query:', insertErr);
              sql.close(); // Close the database connection
              return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Insert successful
            sql.close(); // Close the database connection
            res.json({ message: 'User created successfully' });
          });
        });
      });
    } catch (error) {
      console.error('Error executing query:', error);
      sql.close(); // Close the database connection
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};

/*user*/

/*-------------account configuration----------------*/
exports.accountconfiguration = async (req, res, next) => {
  console.log(req.body);

  const {
    WholesaleLedger,
    CGSTLedger,
    SGSTLedger,
    IGSTLedger,
    Round0ffLedger,
    FreightLedger,
    OtherChargesLedger,
    DiscountLedger,
    PurchaseLedger,
    SalesLedger,
    CustomerLedger,
  } = req.body;

  try {
    await poolConnect();
    const result = await pool.request()
      .input('WholesaleLedger', sql.NVarChar(255), WholesaleLedger)
      .input('CGSTLedger', sql.NVarChar(255), CGSTLedger)
      .input('SGSTLedger', sql.NVarChar(255), SGSTLedger)
      .input('IGSTLedger', sql.NVarChar(255), IGSTLedger)
      .input('Round0ffLedger', sql.NVarChar(255), Round0ffLedger)
      .input('FreightLedger', sql.NVarChar(255), FreightLedger)
      .input('OtherChargesLedger', sql.NVarChar(255), OtherChargesLedger)
      .input('DiscountLedger', sql.NVarChar(255), DiscountLedger)
      .input('PurchaseLedger', sql.NVarChar(255), PurchaseLedger)
      .input('SalesLedger', sql.NVarChar(255), SalesLedger)
      .input('CustomerLedger', sql.NVarChar(255), CustomerLedger)
      .execute('InsertAccountConfigurationProcedure');

    console.log(result);
    return res.redirect("/accountconfiguration");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

exports.updateAccountConfiguration = async (req, res) => {
  try {
    // Extract the required fields from req.body
    const {
      WholesaleLedger,
      CGSTLedger,
      SGSTLedger,
      IGSTLedger,
      Round0ffLedger,
      FreightLedger,
      OtherChargesLedger,
      DiscountLedger,
      PurchaseLedger,
      SalesLedger,
      CustomerLedger,
    } = req.body;

    await poolConnect();

    const result = await pool.request()
      .input('WholesaleLedger', sql.NVarChar(255), WholesaleLedger)
      .input('CGSTLedger', sql.NVarChar(255), CGSTLedger)
      .input('SGSTLedger', sql.NVarChar(255), SGSTLedger)
      .input('IGSTLedger', sql.NVarChar(255), IGSTLedger)
      .input('Round0ffLedger', sql.NVarChar(255), Round0ffLedger)
      .input('FreightLedger', sql.NVarChar(255), FreightLedger)
      .input('OtherChargesLedger', sql.NVarChar(255), OtherChargesLedger)
      .input('DiscountLedger', sql.NVarChar(255), DiscountLedger)
      .input('PurchaseLedger', sql.NVarChar(255), PurchaseLedger)
      .input('SalesLedger', sql.NVarChar(255), SalesLedger)
      .input('CustomerLedger', sql.NVarChar(255), CustomerLedger)
      .execute('UpdateAccountConfigurationProcedure');

    console.log(result);

    return res.status(200).json({ message: 'Account configuration updated successfully' });
  } catch (error) {
    console.error('Error updating account configuration:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getaccountconfiguration = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    // Call the stored procedure
    const result = await pool.request().execute('GetAccountConfigurationProcedure');

    console.log('Result:', result);

    // Send the data as JSON response
    res.json({ data: result.recordset });
  } catch (error) {
    console.error('Error getting account configuration data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/*account configuration*/  

/*company*/
 
exports.getcity=(req,res)=>{
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT * FROM [elite_pos].[dbo].[city_Master]', (err, result) => {
      connection.release(); 

      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log(result); 
      }

      res.json({ data: result.recordset });
    });
  });
};

exports.getcompany = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    pool.query('SELECT * FROM [elite_pos].[dbo].[company]', (err, result) => {
      connection.release(); 
      if (err) {
        console.error('Error in listing data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      const dataWithImages = result.recordset.map(row => {
        if (row.logo && row.logo.length > 0) {
          const base64Image = Buffer.from(row.logo).toString('base64');
          const imageSrc = `data:image/jpeg;base64,${base64Image}`;
          row.logoSrc = imageSrc;
        }
        return row;
      });
      res.json({ data: dataWithImages });
    });
  });
};

exports.updatecompany = async (req, res) => {
  try {
    upload.single('logo')(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: 'File upload error' });
      } else if (err) {
        console.error('Unknown error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      const {
        id,
        companyName,
        address,
        billingName,
        state,
        city,
        pincode,
        cin,
        tin,
        gstin,
        pan,
        mobileNo,
        phoneNo,
        email,
        website,
        cashLedger,
        bankLedger,
        bookStartDate,
        discLedger,
        quotes,
      } = req.body;

      let logo = null;

      if (req.file) {
        if (req.file.size > 0) {
          logo = req.file.buffer;
        } else {
          console.log('File is empty.');
        }
      } else {
        console.log('No file received.');
      }

      const companyId = parseInt(id, 10);

      await poolConnect();

      const request = pool.request()
        .input('Id', sql.Int, companyId)
        .input('CompanyName', sql.NVarChar, companyName)
        .input('Address', sql.NVarChar, address)
        .input('BillingName', sql.NVarChar, billingName)
        .input('State', sql.NVarChar, state)
        .input('City', sql.NVarChar, city)
        .input('Pincode', sql.NVarChar, pincode)
        .input('CIN', sql.NVarChar, cin)
        .input('TIN', sql.NVarChar, tin)
        .input('GSTIN', sql.NVarChar, gstin)
        .input('PAN', sql.NVarChar, pan)
        .input('MobileNo', sql.NVarChar, mobileNo)
        .input('PhoneNo', sql.NVarChar, phoneNo)
        .input('Email', sql.NVarChar, email)
        .input('Website', sql.NVarChar, website)
        .input('CashLedger', sql.NVarChar, cashLedger)
        .input('BankLedger', sql.NVarChar, bankLedger)
        .input('BookStartDate', sql.Date, bookStartDate)
        .input('DiscLedger', sql.NVarChar, discLedger)
        .input('quotes', sql.VarChar, quotes);
      if (logo !== null) {
        request.input('Logo', sql.VarBinary, logo );
      }

      const result = await request.execute('UpdateCompanyProcedure');

      console.log('Update result:', result);

      return res.status(200).json({ message: 'Company updated successfully' });
    });
  } catch (error) {
    console.error('Error updating company:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.company = async (req, res, next) => {
  console.log(req.body);
  const {
    companyName,
    address,
    billingName,
    state,
    city,
    pincode,
    cin,
    tin,
    gstin,
    pan,
    mobileNo,
    phoneNo,
    email,
    website,
    cashLedger,
    bankLedger,
    bookStartDate,
    discLedger,
    quotes,
  } = req.body;
  try {
    await poolConnect();
    const logoFilePath = logoFile ? req.file.path : null; 
    const result = await pool.request()
      .input('CompanyName', sql.NVarChar, companyName)
      .input('Address', sql.NVarChar, address)
      .input('BillingName', sql.NVarChar, billingName)
      .input('State', sql.NVarChar, state)
      .input('City', sql.NVarChar, city)
      .input('Pincode', sql.NVarChar, pincode)
      .input('CIN', sql.NVarChar, cin)
      .input('TIN', sql.NVarChar, tin)
      .input('GSTIN', sql.NVarChar, gstin)
      .input('PAN', sql.NVarChar, pan)
      .input('MobileNo', sql.NVarChar, mobileNo)
      .input('PhoneNo', sql.NVarChar, phoneNo)
      .input('Email', sql.NVarChar, email)
      .input('Website', sql.NVarChar, website)
      .input('CashLedger', sql.NVarChar, cashLedger)
      .input('BankLedger', sql.NVarChar, bankLedger)
      .input('BookStartDate', sql.Date, bookStartDate)
      .input('DiscLedger', sql.NVarChar, discLedger)
      .input('quotes', sql.VarChar, quotes)
      .input('LogoFilePath', sql.NVarChar, logoFilePath)
      .execute('InsertCompanyProcedure');
    console.log(result);
    return res.redirect("/company");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

/*company*/
  
/*login*/ 

async function getSidebarItemsForRole(roleName) {
  try {
    console.log('Role name:', roleName); 
    if (!roleName) {
      throw new Error('Role name is undefined or empty.');
    }

    const result = await pool.request()
      .input('roleName', sql.NVarChar, roleName)
      .query(`
        SELECT title, href,  menu
        FROM [elite_pos].[dbo].[menu_access_rights]
        WHERE [${roleName}] = 1`);

    return result.recordset;
  } catch (error) {
    console.error('Error fetching sidebar items for role:', error.message);
    return []; 
  }
};

exports.sidebar = async (req, res) => {
  try {
    const roleName = req.session.userRole;
    console.log('Received role name:', roleName);
    if (!roleName) {
      throw new Error('Role name is undefined or empty.');
    }
    const sidebarItems = await getSidebarItemsForRole(roleName);
    res.status(200).json({ sidebarItems, role: roleName }); 
  } catch (error) {
    console.error('An error occurred while fetching sidebar items:', error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    await poolConnect();
    const emailid = req.body.emailid;  
    const password = req.body.password;
    console.log('Checking if email is already taken');
    const emailCheckResult = await pool.query`SELECT ID, emailid, password, role FROM [elite_pos].[dbo].[registeration] WHERE emailid = ${emailid}`;
    console.log('Email check result:', emailCheckResult);
    if (emailCheckResult.recordset.length <= 0) {
      return res.status(401).render("login", { msg: "Email or password incorrect", msg_type: "error" });
    }
    const user = emailCheckResult.recordset[0];
    const hashedPasswordFromDB = user.password;
    console.log('Hashed Password from the Database:', hashedPasswordFromDB);
    console.log('Given Password:', password);
    const isPasswordValid = await bcrypt.compare(password, hashedPasswordFromDB);
    if (!password || !isPasswordValid) {
      return res.status(401).render("login", { msg: "Email or password incorrect", msg_type: "error" });
    }
    const roleId = user.role;
    if (!roleId) {
      throw new Error('Role ID not found for the user.');
    }
    const roleResult = await pool.request()
      .input('roleId', sql.Int, roleId)
      .query('SELECT role FROM [role] WHERE id = @roleId');
    const roleName = roleResult.recordset[0].role;
    console.log('User Role:', roleName);
    req.session.userRole = roleName; 
    req.session.save(() => {
      res.redirect(`/index`);
    });
  } catch (error) {
    console.error('An error occurred:', error.message);
    return res.status(500).render("login", { msg: "Internal server error", msg_type: "error" });
  }
};

/*login*/

/*registration*/

exports.registration = async (req, res) => {
  try {
    await poolConnect();

    const { userid, emailid, password } = req.body;

    console.log('Checking if email is already taken');
    const emailCheckResult = await pool.query`SELECT emailid FROM [elite_pos].[dbo].[registeration] WHERE emailid = ${emailid}`;

    console.log('Email check result:', emailCheckResult);

    if (!emailCheckResult || !emailCheckResult.recordset || !Array.isArray(emailCheckResult.recordset)) {
      console.error('Unexpected emailCheckResult format:', emailCheckResult);
      return res.status(500).json({ msg: "An unexpected error occurred", msg_type: "error" });
    }

    if (emailCheckResult.recordset.length > 0) {
      return res.status(400).json({ msg: "Email id already taken", msg_type: "error" });
    }

    if (!password || password.length < 8) {
      console.error('Invalid password:', password);
      return res.status(400).json({ msg: "Invalid password (must be at least 8 characters long)", msg_type: "error" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    console.log('Inserting user into the database');
    await pool.query`INSERT INTO [elite_pos].[dbo].[registeration] (userid, emailid, password, role) VALUES (${userid}, ${emailid}, ${hashedPassword}, 6)`;

    console.log('User ID:', userid);
    console.log('Email ID:', emailid);
    console.log('Hashed Password:', hashedPassword);

    return res.status(200).json({ msg: "User registration success", msg_type: "good" });
 
  } catch (error) {
    console.error('An error occurred:', error.message);
    return res.status(500).json({ msg: "An error occurred", msg_type: "error" });
  }
};

/*registration*/