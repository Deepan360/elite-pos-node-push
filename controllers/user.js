const sql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    throw error; // Make sure to rethrow the error to handle it in the calling function
  }
};


/*contra*/

exports.contraCr = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT  [ledgername] FROM [elite_pos].[dbo].[ledger]', (err, result) => {
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

exports.contraDr = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query(
      'SELECT ledgername FROM [elite_pos].[dbo].[ledger] ' +
      'UNION ' +
      'SELECT ledgername  FROM [elite_pos].[dbo].[customer] ' +
      'UNION ' +
      'SELECT ledgername  FROM [elite_pos].[dbo].[supplier] ' +
      'UNION ' +
      'SELECT ledgername  FROM [elite_pos].[dbo].[salesman]', (err, result) => {
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

    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[contra]
      ([contradate], [cash/bankLedger(cr)], [ledger(dr)],[amount],   [billno], 
      [discount], [remarks])
      VALUES
      (${formattedcontraDate}, ${cr}, ${dr}, ${billno},${amount},${discount}, ${remarks})`;
    console.log('Formatted contra Date:', formattedcontraDate);
    console.log('DR Value:', dr);
    // ... add more log statements
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
      .input('manufacturerId', /* Assuming your parameter type is INT */ sql.Int, manufacturerId)
      .query('DELETE FROM [elite_pos].[dbo].[contra] WHERE id = @manufacturerId');
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "contra deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "contra not found" });
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
    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[contra]
      SET
      [contradate] = ${formattedcontraDate},
      [cash/bankLedger(cr)] = ${cr},
      [ledger(dr)] = ${dr},
      [billno] = ${billno},
      [amount] = ${amount},
      [discount] = ${discount},
      [remarks] = ${remarks}
      WHERE
        id = ${manufacturerId}
    `;
    console.log('Formatted contra Date:', formattedcontraDate);
    console.log('DR Value:', dr);
    // ... add more log statements
    console.log(result);
    console.log(result.toString());
    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "contra updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., customer ID not found)
      return res.status(404).json({ success: false, error: "Multicontra not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.contra = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT *  FROM [elite_pos].[dbo].[contra]', (err, result) => {
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

/*contra*/


/*creditnotes*/
exports.creditnoteparticulars = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query(
      'SELECT ledgername FROM [elite_pos].[dbo].[ledger] ' +
      'UNION ' +
      'SELECT ledgername  FROM [elite_pos].[dbo].[customer] ' +
      'UNION ' +
      'SELECT ledgername  FROM [elite_pos].[dbo].[supplier] ' +
      'UNION ' +
      'SELECT ledgername  FROM [elite_pos].[dbo].[salesman]', (err, result) => {
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

    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[creditnote]
      ([creditnotedate], particulars, [amount(dr)],[amount(cr)],   [billno], 
       [remarks])
      VALUES
      (${formattedcreditnoteDate}, ${Particulars}, ${dr}, ${cr},${billno}, ${remarks})`;
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
  const manufacturerId = req.params.id;
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();
    const result = await pool.request()
      .input('manufacturerId', /* Assuming your parameter type is INT */ sql.Int, manufacturerId)
      .query('DELETE FROM [elite_pos].[dbo].[creditnote] WHERE id = @manufacturerId');
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "creditnote deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "creditnote not found" });
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
    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[creditnote]
      SET
      [creditnotedate] = ${formattedcreditnoteDate},
      [particulars] = ${particulars},
      [amount(dr)] = ${dr},
      [amount(cr)] = ${cr},
      [billno] = ${billno},
      [remarks] = ${remarks}
      WHERE
        id = ${manufacturerId}
    `;
    console.log('Formatted creditnote Date:', formattedcreditnoteDate);
    console.log('DR Value:', dr);
    // ... add more log statements
    console.log(result);
    console.log(result.toString());
    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "creditnote updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., customer ID not found)
      return res.status(404).json({ success: false, error: "Multicreditnote not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.creditnote = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT *  FROM [elite_pos].[dbo].[creditnote]', (err, result) => {
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



/*creditnotes*/




/*journals*/
exports.journalparticulars = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query(
      'SELECT ledgername FROM [elite_pos].[dbo].[ledger] ' +
      'UNION ' +
      'SELECT ledgername  FROM [elite_pos].[dbo].[customer] ' +
      'UNION ' +
      'SELECT ledgername  FROM [elite_pos].[dbo].[supplier] ' +
      'UNION ' +
      'SELECT ledgername  FROM [elite_pos].[dbo].[salesman]', (err, result) => {
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

exports.journaladd = async (req, res) => {
  console.log(req.body);
  const {
    journaldate, Particulars, dr, cr, billno, remarks
  } = req.body;

  // Handle date values
  const formattedjournalDate = journaldate ? journaldate : null;


  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[journal]
      ([journaldate], particulars, [amount(dr)],[amount(cr)],   [billno], 
       [remarks])
      VALUES
      (${formattedjournalDate}, ${Particulars}, ${dr}, ${cr},${billno}, ${remarks})`;
    console.log('Formatted journal Date:', formattedjournalDate);
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
      .input('manufacturerId', /* Assuming your parameter type is INT */ sql.Int, manufacturerId)
      .query('DELETE FROM [elite_pos].[dbo].[journal] WHERE id = @manufacturerId');
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "journal deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "journal not found" });
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
  // Handle date values
  const formattedjournalDate = journaldate ? journaldate : null;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();
    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[journal]
      SET
      [journaldate] = ${formattedjournalDate},
      [particulars] = ${particulars},
      [amount(dr)] = ${dr},
      [amount(cr)] = ${cr},
      [billno] = ${billno},
      [remarks] = ${remarks}
      WHERE
        id = ${manufacturerId}
    `;
    console.log('Formatted journal Date:', formattedjournalDate);
    console.log('DR Value:', dr);
    // ... add more log statements
    console.log(result);
    console.log(result.toString());
    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "journal updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., customer ID not found)
      return res.status(404).json({ success: false, error: "Multijournal not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.journal = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT *  FROM [elite_pos].[dbo].[journal]', (err, result) => {
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



/*journals*/
/*ledgerob*/
exports.ledgerData = (req, res) => {
  const ledgerTypeDesc = req.query.ledgerTypeDesc;
  console.log('Received request for ledger data with ledgerTypeDesc:', ledgerTypeDesc);

  if (!ledgerTypeDesc) {
    return res.status(400).json({ error: 'Invalid ledger type description' });
  }

  const allowedTables = ['customer', 'salesman', 'supplier', 'ledger'];

  if (!allowedTables.includes(ledgerTypeDesc)) {
    return res.status(400).json({ error: 'Invalid ledger type description' });
  }

  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const query = `SELECT id, code, ledgername, openingdate, dramount, cramount FROM [elite_pos].[dbo].${ledgerTypeDesc}`;

    pool.query(query, (err, result) => {
      connection.release();

      if (err) {
        console.error('Error in fetching ledger data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('Query Result:', result);
      console.log('ledgerTypeDesc:', ledgerTypeDesc);

      // Send the data as JSON response
      res.json({ data: result.recordset });
    });
  });
};


exports.ledgerob = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const query = 'SELECT [ledger_Type_Desc] FROM [elite_pos].[dbo].[ledger_Type_Master]';

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
exports.getuom = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT shortname FROM [elite_pos].[dbo].[uom]', (err, result) => {
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

exports.gettype = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT [producttype] FROM [elite_pos].[dbo].[producttype]', (err, result) => {
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

exports.getproduct = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT [productname] FROM [elite_pos].[dbo].[product]', (err, result) => {
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

//product//



/*payment*/

exports.paymentCr = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT  [ledgername] FROM [elite_pos].[dbo].[ledger]', (err, result) => {
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

exports.paymentDr = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query(
      'SELECT ledgername FROM [elite_pos].[dbo].[ledger] ' +
      'UNION ' +
      'SELECT ledgername  FROM [elite_pos].[dbo].[customer] ' +
      'UNION ' +
      'SELECT ledgername  FROM [elite_pos].[dbo].[supplier] ' +
      'UNION ' +
      'SELECT ledgername  FROM [elite_pos].[dbo].[salesman]', (err, result) => {
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

    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[payment]
      ([paymentdate], [cash/bankLedger(cr)], [ledger(dr)],[amount],   [billno], 
      [discount], [remarks])
      VALUES
      (${formattedpaymentDate}, ${cr}, ${dr}, ${billno},${amount},${discount}, ${remarks})`;
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
      .query('DELETE FROM [elite_pos].[dbo].[payment] WHERE id = @manufacturerId');
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
    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[payment]
      SET
      [paymentdate] = ${formattedpaymentDate},
      [cash/bankLedger(cr)] = ${cr},
      [ledger(dr)] = ${dr},
      [billno] = ${billno},
      [amount] = ${amount},
      [discount] = ${discount},
      [remarks] = ${remarks}
      WHERE
        id = ${manufacturerId}
    `;
    console.log('Formatted payment Date:', formattedpaymentDate);
    console.log('DR Value:', dr);
    // ... add more log statements
    console.log(result);
    console.log(result.toString());
    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "payment updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., customer ID not found)
      return res.status(404).json({ success: false, error: "Multipayment not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.payment = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT *  FROM [elite_pos].[dbo].[payment]', (err, result) => {
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

/*payment*/



/*----recipt---*/

exports.receiptadd = async (req, res) => {
  console.log(req.body);
  const {
    receiptdate, dr, cr, billno, amount, discount, remarks
  } = req.body;

  // Handle date values
  const formattedReciptDate = receiptdate ? receiptdate : null;


  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[receipt]
      ([receiptdate], [cash/bankLedger(dr)], [customerLedger(cr)],  [billno],[amount],  [discount], [remarks])
      VALUES
      (${formattedReciptDate}, ${dr}, ${cr},  ${billno},${amount},  ${discount}, ${remarks})`;
    console.log('Formatted Recipt Date:', formattedReciptDate);
    console.log('DR Value:', dr);
    // ... add more log statements
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
    const result = await pool.request()
      .input('manufacturerId', /* Assuming your parameter type is INT */ sql.Int, manufacturerId)
      .query('DELETE FROM [elite_pos].[dbo].[receipt] WHERE id = @manufacturerId');
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "receipt deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "receipt not found" });
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
  // Handle date values
  const formattedReceiptDate = receiptdate ? receiptdate : null;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();
    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[receipt]
      SET
      [receiptdate] = ${formattedReceiptDate},
      [cash/bankLedger(dr)] = ${dr},
      [customerLedger(cr)] = ${cr},
      [billno] = ${billno},
      [amount] = ${amount},
      [discount] = ${discount},
      [remarks] = ${remarks}
      WHERE
        id = ${manufacturerId}
    `;

    console.log('Manufacturer ID:', manufacturerId);

    console.log('Formatted Recipt Date:', formattedReceiptDate);
    console.log('DR Value:', dr);
    // ... add more log statements
    console.log(result);
    console.log(result.toString());
    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "receipt updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., customer ID not found)
      return res.status(404).json({ success: false, error: "receipt not found" });
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

    pool.query('SELECT *  FROM [elite_pos].[dbo].[receipt]', (err, result) => {
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
exports.receiptCr = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT  [ledgername] FROM [elite_pos].[dbo].[ledger]', (err, result) => {
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

exports.receiptDr = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT  [ledgername] FROM [elite_pos].[dbo].[customer]', (err, result) => {
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

/*------receipt------*/
/*----multipayment---*/

exports.multipaymentadd = async (req, res) => {
  console.log(req.body);
  const {
    paymentdate, cr, dr, amount, billno, billdate, billamount,
    recdamount, discamount, balance
  } = req.body;

  // Handle date values
  const formattedpaymentDate = paymentdate ? paymentdate : null;
  const formattedBillDate = billdate ? billdate : null;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[multipayment]
      ([paymentdate], [cash/bankLedger(cr)], [supplierLedger(dr)], [amount], [billno], [billdate], [billamount],
      [recdamount], [discamount], [balance])
      VALUES
      (${formattedpaymentDate}, ${cr}, ${dr}, ${amount}, ${billno}, ${formattedBillDate}, ${billamount},
       ${recdamount}, ${discamount}, ${balance})`;
    console.log('Formatted payment Date:', formattedpaymentDate);
    console.log('DR Value:', dr);
    // ... add more log statements
    console.log(result);
    // Redirect to another route after processing
    return res.redirect('/multipayment');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

exports.multipaymentdelete = async (req, res) => {
  const manufacturerId = req.params.id;
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();
    const result = await pool.request()
      .input('manufacturerId', /* Assuming your parameter type is INT */ sql.Int, manufacturerId)
      .query('DELETE FROM [elite_pos].[dbo].[multipayment] WHERE id = @manufacturerId');
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Multipayment deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "Multipayment not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.multipaymentedit = async (req, res) => {
  const manufacturerId = req.params.id;
  const {
    paymentdate, dr, cr, amount, billno, billdate, billamount,
    recdamount, discamount, balance
  } = req.body;
  // Handle date values
  const formattedpaymentDate = paymentdate ? paymentdate : null;
  const formattedBillDate = billdate ? billdate : null;
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();
    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[multipayment]
      SET
      [paymentdate] = ${formattedpaymentDate},
      [cash/bankLedger(dr)] = ${dr},
      [customerLedger(cr)] = ${cr},
      [amount] = ${amount},
      [billno] = ${billno},
      [billdate] = ${formattedBillDate},
      [billamount] = ${billamount},
      [recdamount] = ${recdamount},
      [discamount] = ${discamount},
      [balance] = ${balance}
      WHERE
        id = ${manufacturerId}
    `;
    console.log('Formatted payment Date:', formattedpaymentDate);
    console.log('DR Value:', dr);
    // ... add more log statements
    console.log(result);
    console.log(result.toString());
    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Multipayment updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., customer ID not found)
      return res.status(404).json({ success: false, error: "Multipayment not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.multipayment = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT *  FROM [elite_pos].[dbo].[multipayment]', (err, result) => {
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

exports.getPaymentCr = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT  [ledgername] FROM [elite_pos].[dbo].[ledger]', (err, result) => {
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

exports.getPaymentDr = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT  [ledgername] FROM [elite_pos].[dbo].[supplier]', (err, result) => {
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


/*----multipayment---*/

/*----multireceipt---*/

exports.multireceiptadd = async (req, res) => {
  console.log(req.body);
  const {
    reciptdate, dr, cr, amount, billno, billdate, billamount,
    recdamount, discamount, balance
  } = req.body;

  // Handle date values
  const formattedReciptDate = reciptdate ? reciptdate : null;
  const formattedBillDate = billdate ? billdate : null;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[multirecipt]
      ([reciptdate], [cash/bankLedger(dr)], [customerLedger(cr)], [amount], [billno], [billdate], [billamount],
      [recdamount], [discamount], [balance])
      VALUES
      (${formattedReciptDate}, ${dr}, ${cr}, ${amount}, ${billno}, ${formattedBillDate}, ${billamount},
       ${recdamount}, ${discamount}, ${balance})`;
    console.log('Formatted Recipt Date:', formattedReciptDate);
    console.log('DR Value:', dr);
    // ... add more log statements
    console.log(result);
    // Redirect to another route after processing
    return res.redirect('/multireceipt');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

exports.multireceiptdelete = async (req, res) => {
  const manufacturerId = req.params.id;
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();
    const result = await pool.request()
      .input('manufacturerId', /* Assuming your parameter type is INT */ sql.Int, manufacturerId)
      .query('DELETE FROM [elite_pos].[dbo].[multirecipt] WHERE id = @manufacturerId');
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "multireceipt deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "multireceipt not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.multireceiptedit = async (req, res) => {
  const manufacturerId = req.params.id;
  const {
    reciptdate, dr, cr, amount, billno, billdate, billamount,
    recdamount, discamount, balance
  } = req.body;
  // Handle date values
  const formattedReciptDate = reciptdate ? reciptdate : null;
  const formattedBillDate = billdate ? billdate : null;
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();
    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[multirecipt]
      SET
      [reciptdate] = ${formattedReciptDate},
      [cash/bankLedger(dr)] = ${dr},
      [customerLedger(cr)] = ${cr},
      [amount] = ${amount},
      [billno] = ${billno},
      [billdate] = ${formattedBillDate},
      [billamount] = ${billamount},
      [recdamount] = ${recdamount},
      [discamount] = ${discamount},
      [balance] = ${balance}
      WHERE
        id = ${manufacturerId}
    `;
    console.log('Formatted Recipt Date:', formattedReciptDate);
    console.log('DR Value:', dr);
    // ... add more log statements
    console.log(result);
    console.log(result.toString());
    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "multireceipt updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., customer ID not found)
      return res.status(404).json({ success: false, error: "multireceipt not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.multireceipt = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT *  FROM [elite_pos].[dbo].[multirecipt]', (err, result) => {
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

exports.getCr = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT  [ledgername] FROM [elite_pos].[dbo].[ledger]', (err, result) => {
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

exports.getDr = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT  [ledgername] FROM [elite_pos].[dbo].[customer]', (err, result) => {
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


/*----multireceipt---*/



/*****subgroup */

exports.subgroupadd = async (req, res) => {
  console.log(req.body);

  const {
    subgroupname, parentgroup
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[subgroup]
      (subgroupname,parentgroup)
      VALUES
      ( ${subgroupname}, ${parentgroup})
    `;
    console.log(result);
    console.log(result.toString());


    // Redirect to another route after processing
    return res.redirect('/subgroup');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};


exports.subgroupdelete = async (req, res) => {
  const uomId = req.params.id;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('uomId', /* Assuming your parameter type is INT */ sql.Int, uomId)
      .query('DELETE FROM [elite_pos].[dbo].[subgroup] WHERE id = @uomId');

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "subgroup deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "productId not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


exports.subgroupedit = async (req, res) => {
  const uomId = req.params.id;

  // Extract the product data from the request body
  const {
    subgroupname, parentgroup
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[subgroup]
      SET
      subgroupname = ${subgroupname},
      parentgroup = ${parentgroup}
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



exports.subgroup = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    pool.query('SELECT *  FROM [elite_pos].[dbo].[subgroup]', (err, result) => {
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

/*****subgroup */



/* ---ledger----*/
exports.ledgeradd = async (req, res) => {
  console.log(req.body);

  const {
    code, ledgername, group, subgroup, paymentlimit, openingdate, dramount, cramount, active
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[ledger]
      (code, ledgername, [group], subgroup, paymentlimit, openingdate, dramount, cramount, active)
      VALUES
      (${code}, ${ledgername}, ${group}, ${subgroup}, ${paymentlimit}, ${openingdate}, ${dramount}, ${cramount}, ${active} )
    `;
    console.log(result);
    console.log(result.toString());

    console.log('Database Insert Result:', JSON.stringify(result, null, 2));
    return res.redirect('/ledger');



  } catch (error) {
    console.error(error);
    return res.status(500).send(`Internal Server Error: ${error.message}`);

  }
};


exports.ledgerdelete = async (req, res) => {
  const salesmanId = req.params.id;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('salesmanId', /* Assuming your parameter type is INT */ sql.Int, salesmanId)
      .query('DELETE FROM [elite_pos].[dbo].[ledger] WHERE id = @salesmanId');

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "salesmanId deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "salesmanId not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};



exports.ledgeredit = async (req, res) => {
  const customerId = req.params.id;

  // Extract the customer data from the request body
  const {
    code, ledgername, group, subgroup, paymentlimit, openingdate, dramount, cramount, active

  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[ledger]
      SET
        code = ${code},
        ledgername = ${ledgername},
        [group] = ${group},
        subgroup = ${subgroup},
        paymentlimit = ${paymentlimit},
        openingdate = ${openingdate},
        dramount = ${dramount},
        cramount = ${cramount},
        active = ${active}
        
       
      WHERE
        id = ${customerId}
    `;

    console.log(result);
    console.log(result.toString());

    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "ledger updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., customer ID not found)
      return res.status(404).json({ success: false, error: "ledger not found" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


exports.ledger = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT * FROM [elite_pos].[dbo].[ledger]', (err, result) => {
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

/* ---ledger----*/


/* ---salesman----*/
exports.salesmanadd = async (req, res) => {
  console.log(req.body);

  const {
    code, ledgername, mobile, aadhar, email, openingdate, address, city, state,
    pincode
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[salesman]
      (code, ledgername, mobile, aadhar, email, openingdate, address, city, state,
        pincode)
      VALUES
      (${code}, ${ledgername}, ${mobile}, ${aadhar}, ${email}, ${openingdate}, ${address}, ${city}, ${state},
       ${pincode}  )
    `;
    console.log(result);
    console.log(result.toString());


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
      .input('salesmanId', /* Assuming your parameter type is INT */ sql.Int, salesmanId)
      .query('DELETE FROM [elite_pos].[dbo].[salesman] WHERE id = @salesmanId');

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "salesmanId deleted successfully" });
    } else {
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

    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[salesman]
      SET
        code = ${code},
        ledgername = ${ledgername},
        mobile = ${mobile},
        aadhar = ${aadhar},
        email = ${email},
        openingdate = ${openingdate},
        address = ${address},
        city = ${city},
        state = ${state},
        pincode = ${pincode}
       
      WHERE
        id = ${customerId}
    `;

    console.log(result);
    console.log(result.toString());

    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "salesman updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., customer ID not found)
      return res.status(404).json({ success: false, error: "salesman not found" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


exports.salesman = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT * FROM [elite_pos].[dbo].[salesman]', (err, result) => {
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



exports.stockob = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT *  FROM [elite_pos].[dbo].[stockob]', (err, result) => {
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

/*****stockob */

/*****UOM */

exports.uomadd = async (req, res) => {
  console.log(req.body);

  const {
    unitname, shortname, baseunit, baseqty, complexunit
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[uom]
      ( unitname,shortname,baseunit,baseqty,complexunit)
      VALUES
      ( ${unitname}, ${shortname},${baseunit},${baseqty},${complexunit})
    `;
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
      .query('DELETE FROM [elite_pos].[dbo].[uom] WHERE id = @uomId');

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "uomId deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "productId not found" });
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

    pool.query('SELECT *  FROM [elite_pos].[dbo].[uom]', (err, result) => {
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

    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[productcategory]
      (Category_code, Product_Category,Active)
      VALUES
      ( ${categorycode}, ${productcategory},${active})
    `;
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
      .input('CategoryId', /* Assuming your parameter type is INT */ sql.Int, CategoryId)
      .query('DELETE FROM [elite_pos].[dbo].[productcategory] WHERE id = @CategoryId');

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


exports.productcategoryedit = async (req, res) => {
  const productcategoryId = req.params.id;

  // Extract the product data from the request body
  const {
    categorycode, productcategory, active
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[productcategory]
      SET
      Category_code = ${categorycode},
      Product_Category = ${productcategory},
      Active=${active}
      WHERE
        id = ${productcategoryId}
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



exports.productcategory = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT *  FROM [elite_pos].[dbo].[productcategory]', (err, result) => {
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
    code, productname, description, hsnCode, category, productType, measurement, uom, tax, active
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[product]
      (code, productname,description,hsnCode,category,productType,measurement,uom,tax,active)
      VALUES
      ( ${code}, ${productname}, ${description}, ${hsnCode},  ${category} ,${productType}, ${measurement}, ${uom},  ${tax} ,${active} )
    `;
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
      .input('productId', /* Assuming your parameter type is INT */ sql.Int, productId)
      .query('DELETE FROM [elite_pos].[dbo].[product] WHERE id = @productId');

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


exports.productedit = async (req, res) => {
  const productId = req.params.id;

  // Extract the product data from the request body
  const {
    code, productname, description, hsnCode, category, productType, measurement, uom, tax, active
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[product]
      SET
      code = ${code},
      productname = ${productname},
      description = ${description},
      hsnCode = ${hsnCode},
      category = ${category},
      productType = ${productType},
      measurement = ${measurement},
      uom = ${uom},
      tax = ${tax},
      active = ${active}
      WHERE
        id = ${productId}
    `;

    console.log(result);
    console.log(result.toString());

    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Product updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., product ID not found)
      return res.status(404).json({ success: false, error: "Product not found" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};



exports.product = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT *  FROM [elite_pos].[dbo].[product]', (err, result) => {
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

/*****product */

/*****customerdisc */

exports.customerdiscadd = async (req, res) => {
  console.log(req.body);

  const {
    customername, products, disc, discmoney
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[customerdisc]
      ( customername, products,  disc,  discmoney)
      VALUES
      ( ${customername}, ${products}, ${disc},  ${discmoney}  )
    `;
    console.log(result);
    console.log(result.toString());


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
      .input('customerdiscId', /* Assuming your parameter type is INT */ sql.Int, customerdiscId)
      .query('DELETE FROM [elite_pos].[dbo].[customerdisc] WHERE id = @customerdiscId');

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "customerdisc deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "customerdisc not found" });
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
    id, customername, products, disc, discmoney
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[customerdisc]
      SET
      customername = ${customername},
      products = ${products},
      disc = ${disc},
      discmoney = ${discmoney}
      
       
      WHERE
        id = ${customerdiscId}
    `;

    console.log(result);
    console.log(result.toString());

    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "customerdisc updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., customer ID not found)
      return res.status(404).json({ success: false, error: "customerdisc not found" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


exports.customerdisc = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT *  FROM [elite_pos].[dbo].[customerdisc]', (err, result) => {
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

/*****customerdisc */

/*----manufacturer---*/
exports.manufactureradd = async (req, res) => {
  console.log(req.body);

  const {
    code, manufacturername, contactNo, gstin, address, city, state,
    pincode
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[manufacturer]
      (code, manufacturername, contactNo,  gstin,  address, city, state,
      pincode)
      VALUES
      (${code}, ${manufacturername}, ${contactNo}, ${gstin},  ${address}, ${city}, ${state},
       ${pincode}  )
    `;
    console.log(result);
    console.log(result.toString());


    // Redirect to another route after processing
    return res.redirect('/manufacturer');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};


exports.manufacturerdelete = async (req, res) => {
  const manufacturerId = req.params.id;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('manufacturerId', /* Assuming your parameter type is INT */ sql.Int, manufacturerId)
      .query('DELETE FROM [elite_pos].[dbo].[manufacturer] WHERE id = @manufacturerId');

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "manufacturer deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "manufacturer not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};



exports.manufactureredit = async (req, res) => {
  const manufacturerId = req.params.id;

  // Extract the customer data from the request body
  const {
    code, manufacturername, contactNo, gstin, address, city, state,
    pincode
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[manufacturer]
      SET
        code = ${code},
        manufacturername = ${manufacturername},
        contactNo = ${contactNo},
        gstin = ${gstin},
        address = ${address},
        city = ${city},
        state = ${state},
        pincode = ${pincode}
       
      WHERE
        id = ${manufacturerId}
    `;

    console.log(result);
    console.log(result.toString());

    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "manufacturer updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., customer ID not found)
      return res.status(404).json({ success: false, error: "manufacturer not found" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


exports.manufacturer = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT *  FROM [elite_pos].[dbo].[manufacturer]', (err, result) => {
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
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[customer]
      (code, ledgername, subgroup, gstin, pan, contactPerson, mobile, phone, email,
       creditday, creditlimit, allowdisc, disc, pmtmode, address, city, state,
       location, pincode, beneficeiryname, acctnumber, ifsc, bankname, bankbranch, bankphone, openingdate,
       dramount, cramount, active)
      VALUES
      (${code}, ${ledgername}, ${subgroup}, ${gstin}, ${pan}, ${contactPerson}, ${mobile}, ${phone}, ${email},
       ${creditday}, ${creditlimit}, ${allowdisc}, ${disc}, ${pmtmode}, ${address}, ${city}, ${state},
       ${location}, ${pincode}, ${beneficeiryname}, ${acctnumber}, ${ifsc}, ${bankname}, ${bankbranch}, ${bankphone}, ${openingdate},
       ${dramount}, ${cramount}, ${active}  )
    `;
    console.log(result);
    console.log(result.toString());


    // Redirect to another route after processing
    return res.redirect('/customer');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};


exports.customerdelete = async (req, res) => {
  const customerId = req.params.id;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('customerId', /* Assuming your parameter type is INT */ sql.Int, customerId)
      .query('DELETE FROM [elite_pos].[dbo].[customer] WHERE id = @customerId');

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

  // Extract the customer data from the request body
  const {
    code, ledgername, subgroup, gstin, pan, contactPerson, mobile, phone, email,
    creditday, creditlimit, allowdisc, disc, pmtmode, address, city, state,
    location, pincode, beneficeiryname, acctnumber, ifsc, bankname, bankbranch, bankphone, openingdate,
    dramount, cramount, active
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[customer]
      SET
        code = ${code},
        ledgername = ${ledgername},
        subgroup = ${subgroup},
        gstin = ${gstin},
        pan = ${pan},
        contactPerson = ${contactPerson},
        mobile = ${mobile},
        phone = ${phone},
        email = ${email},
        creditday = ${creditday},
        creditlimit = ${creditlimit},
        allowdisc = ${allowdisc},
        disc = ${disc},
        pmtmode = ${pmtmode},
        address = ${address},
        city = ${city},
        state = ${state},
        location = ${location},
        pincode = ${pincode},
        beneficeiryname = ${beneficeiryname},
        acctnumber = ${acctnumber},
        ifsc = ${ifsc},
        bankname = ${bankname},
        bankbranch = ${bankbranch},
        bankphone = ${bankphone},
        openingdate = ${openingdate},
        dramount = ${dramount},
        cramount = ${cramount},
        active = ${active}
      WHERE
        id = ${customerId}
    `;

    console.log(result);
    console.log(result.toString());

    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "Customer updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., customer ID not found)
      return res.status(404).json({ success: false, error: "Customer not found" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


exports.customer = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT * FROM [elite_pos].[dbo].[customer]', (err, result) => {
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

/* ---customer----*/

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
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[supplier]
      (code, ledgername, subgroup, gstin, pan, contactPerson, mobile, phone, email,
     allowdisc, disc, pmtmode,paymentlimit, address, city, state,
       location, pincode, beneficeiryname, acctnumber, ifsc, bankname, bankbranch, bankphone, openingdate,
       dramount, cramount, active)
      VALUES
      (${code}, ${ledgername}, ${subgroup}, ${gstin}, ${pan}, ${contactPerson}, ${mobile}, ${phone}, ${email},
       ${allowdisc}, ${disc}, ${pmtmode},${paymentlimit}, ${address}, ${city}, ${state},
       ${location}, ${pincode}, ${beneficeiryname}, ${acctnumber}, ${ifsc}, ${bankname}, ${bankbranch}, ${bankphone}, ${openingdate},
       ${dramount}, ${cramount}, ${active}  )
    `;
    console.log(result);
    console.log(result.toString());


    // Redirect to another route after processing
    return res.redirect('/supplier');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};


exports.supplierdelete = async (req, res) => {
  const supplierId = req.params.id;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.request()
      .input('supplierId', /* Assuming your parameter type is INT */ sql.Int, supplierId)
      .query('DELETE FROM [elite_pos].[dbo].[supplier] WHERE id = @supplierId');

    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "supplier deleted successfully" });
    } else {
      return res.status(404).json({ success: false, error: "supplier not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};



exports.supplieredit = async (req, res) => {
  const supplierId = req.params.id;

  // Extract the supplier data from the request body
  const {
    code, ledgername, subgroup, gstin, pan, contactPerson, mobile, phone, email,
    allowdisc, disc, pmtmode, paymentlimit, address, city, state,
    location, pincode, beneficeiryname, acctnumber, ifsc, bankname, bankbranch, bankphone, openingdate,
    dramount, cramount, active
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const result = await pool.query`
      UPDATE [elite_pos].[dbo].[supplier]
      SET
        code = ${code},
        ledgername = ${ledgername},
        subgroup = ${subgroup},
        gstin = ${gstin},
        pan = ${pan},
        contactPerson = ${contactPerson},
        mobile = ${mobile},
        phone = ${phone},
        email = ${email},
        allowdisc = ${allowdisc},
        disc = ${disc},
        pmtmode = ${pmtmode},
        paymentlimit=${paymentlimit},
        address = ${address},
        city = ${city},
        state = ${state},
        location = ${location},
        pincode = ${pincode},
        beneficeiryname = ${beneficeiryname},
        acctnumber = ${acctnumber},
        ifsc = ${ifsc},
        bankname = ${bankname},
        bankbranch = ${bankbranch},
        bankphone = ${bankphone},
        openingdate = ${openingdate},
        dramount = ${dramount},
        cramount = ${cramount},
        active = ${active}
      WHERE
        id = ${supplierId}
    `;

    console.log(result);
    console.log(result.toString());

    // Check if the update was successful (at least one row affected)
    if (result.rowsAffected[0] > 0) {
      return res.json({ success: true, message: "supplier updated successfully" });
    } else {
      // Handle the case where no rows were affected (e.g., supplier ID not found)
      return res.status(404).json({ success: false, error: "supplier not found" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


exports.supplier = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT * FROM [elite_pos].[dbo].[supplier]', (err, result) => {
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

/* ---supplier----*/

/*user*/

exports.user = (req, res) => {
  pool.connect((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    pool.query('SELECT id, userid, emailid FROM [elite_pos].[dbo].[registeration]', (err, result) => {
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

/*user*/

/*-------------account configuration*/
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
    // Ensure the database connection is established before proceeding
    await poolConnect();
    // Use the await syntax to handle the asynchronous nature of pool.query
    const result = await pool.query`
      INSERT INTO   [elite_pos].[dbo].[accountconfiguration]
      (WholesaleLedger,CGSTLedger, SGSTLedger, IGSTLedger, Round0ffLedger, FreightLedger, OtherChargesLedger, DiscountLedger, PurchaseLedger, SalesLedger, CustomerLedger)
      VALUES
      (
        ${WholesaleLedger},
        ${CGSTLedger},
        ${SGSTLedger},
        ${IGSTLedger},
        ${Round0ffLedger},
        ${FreightLedger},
        ${OtherChargesLedger},
        ${DiscountLedger},
        ${PurchaseLedger},
        ${SalesLedger},
        ${CustomerLedger}
      
      )
    `;

    console.log(result);

    // Redirect to "/company" after a successful form submission
    return res.redirect("/accountconfiguration");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

/*-acount configuration--*/  

/*company*/

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
  } = req.body;

  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();
    // Use the await syntax to handle the asynchronous nature of pool.query
    const result = await pool.query`
      INSERT INTO [elite_pos].[dbo].[company]
      (companyName,address, billingName, state, city, pincode, cin, tin, gstin, pan, mobileNo, phoneNo, email, website, cashLedger, bankLedger, bookStartDate, discLedger)
      VALUES
      (
        ${companyName},
        ${address},
        ${billingName},
        ${state},
        ${city},
        ${pincode},
        ${cin},
        ${tin},
        ${gstin},
        ${pan},
        ${mobileNo},
        ${phoneNo},
        ${email},
        ${website},
        ${cashLedger},
        ${bankLedger},
        ${bookStartDate},  -- Insert NULL if bookStartDate is empty
        ${discLedger}
      )
    `;

    console.log(result);

    // Redirect to "/company" after a successful form submission
    return res.redirect("/company");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

/*company*/



/*login*/

exports.login = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();
    const jwtSecret = process.env.JWT_SECRET || 'defaultFallbackSecret';
    const emailid = req.body.emailid;  // Use req.body for POST requests
    const password = req.body.password;

    console.log('Checking if email is already taken');
    const emailCheckResult = await pool.query`SELECT ID, emailid, password FROM [elite_pos].[dbo].[registeration] WHERE emailid = ${emailid}`;
    console.log('Email check result:', emailCheckResult);

    // Check if the email exists in the database
    if (emailCheckResult.recordset.length <= 0) {
      return res.status(401).render("login", { msg: "Email or password incorrect", msg_type: "error" });
    }

    const hashedPasswordFromDB = emailCheckResult.recordset[0].password;

    console.log('Hashed Password from the Database:', hashedPasswordFromDB);
    console.log('Given Password:', password);

    // Validate the password
    if (!password || !(await bcrypt.compare(password, hashedPasswordFromDB))) {
      return res.status(401).render("login", { msg: "Email or password incorrect", msg_type: "error" });
    }

    const id = emailCheckResult.recordset[0].ID;
    if (!id) {
      throw new Error('ID not found in the database result.');
    }

    // Check if JWT_SECRET is set
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not set. Please provide a valid secret key.');
    }

    const token = jwt.sign({ id: id }, jwtSecret, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production for secure cookies over HTTPS
    };

    res.cookie("akialm", token, cookieOptions);
    res.status(200).redirect("/index");
  } catch (error) {
    console.error('An error occurred:', error.message);
    return res.status(500).render("login", { msg: "Internal server error", msg_type: "error" });
  }

};
/*login*/


/*registration*/


exports.registration = async (req, res) => {
  try {
    // Ensure the database connection is established before proceeding
    await poolConnect();

    const { userid, emailid, password } = req.body;

    // Check if email is already taken
    console.log('Checking if email is already taken');
    const emailCheckResult = await pool.query`SELECT emailid FROM [elite_pos].[dbo].[registeration] WHERE emailid = '${emailid}'`;

    console.log('Email check result:', emailCheckResult);

    // Ensure emailCheckResult is defined and has a property called 'recordset' that is an array
    if (!emailCheckResult || !emailCheckResult.recordset || !Array.isArray(emailCheckResult.recordset)) {
      console.error('Unexpected emailCheckResult format:', emailCheckResult);
      return res.render("registration", { msg: "An unexpected error occurred", msg_type: "error" });
    }

    if (emailCheckResult.recordset.length > 0) {
      return res.render("registration", { msg: "Email id already taken", msg_type: "error" });
    }

    // Validate password length and match
    if (!password || password.length < 8) {
      console.error('Invalid password:', password);
      return res.render("registration", { msg: "Invalid password", msg_type: "error" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Insert the user into the database
    console.log('Inserting user into the database');
    await pool.query`INSERT INTO [elite_pos].[dbo].[registeration] (userid, emailid, password) VALUES (${userid}, ${emailid}, ${hashedPassword})`;

    console.log('User ID:', userid);
    console.log('Email ID:', emailid);
    console.log('Hashed Password:', hashedPassword);


    console.log(req.body);
    return res.render("registration", { msg: "User registration success", msg_type: "good" });

  } catch (error) {
    console.error('An error occurred:', error.message);
    return res.render("registration", { msg: "An error occurred", msg_type: "error" });
  }
};

/*registration*/