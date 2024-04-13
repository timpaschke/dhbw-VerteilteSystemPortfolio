const express = require('express');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const host = "localhost";
const app = express();
const PORT = 3000;

const adapter = new FileSync('db.json');
const db = low(adapter);

// Server starten
app.use(express.json())
app.listen(PORT, () =>{
    console.log(`Server lauscht auf ${host}:${PORT}`);
});


function generateTransactionId() {
    return Math.random().toString(36).substr(2, 9);
}

app.use(bodyParser.json());

// API-Endpunkte für Banken
app.get('/banks', (req, res) => {
    const banks = db.get('banks').value();
    res.json(banks);
});

app.post('/banks', (req, res) => {
    const newBank = req.body;
    db.get('banks').push(newBank).write();
    res.json(newBank);
});

app.get('/banks/:bank_id', (req, res) => {
    const bank = db.get('banks').find({ bank_id: req.params.bank_id }).value();
    res.json(bank);
});

app.put('/banks/:bank_id', (req, res) => {
    const updatedBank = req.body;
    const bankId = req.params.bank_id;
    
    db.get('banks')
        .find({ bank_id: bankId })
        .assign(updatedBank)
        .write();

    res.json({ bank_id: bankId, ...updatedBank });
});

app.delete('/banks/:bank_id', (req, res) => {
    const bankId = req.params.bank_id;
    
    db.get('banks')
        .remove({ bank_id: bankId })
        .write();

    res.sendStatus(204);
});

app.get('/banks/:bank_id/accounts', (req, res) => {
    const accounts = db.get('accounts').filter({ bank_id: req.params.bank_id }).value();
    res.json(accounts);
});

app.post('/banks/:bank_id/accounts', (req, res) => {
    const newAccount = req.body;
    newAccount.bank_id = req.params.bank_id;
    db.get('accounts').push(newAccount).write();
    res.json(newAccount);
});

app.get('/banks/:bank_id/accounts/:account_number', (req, res) => {
    const account = db.get('accounts').find({ 
        bank_id: req.params.bank_id, 
        account_number: req.params.account_number 
    }).value();
    res.json(account);
});

app.put('/banks/:bank_id/accounts/:account_number', (req, res) => {
    const updatedAccount = req.body;
    const bankId = req.params.bank_id;
    const accountNumber = req.params.account_number;

    db.get('accounts')
        .find({ bank_id: bankId, account_number: accountNumber })
        .assign(updatedAccount)
        .write();

    res.json({ account_number: accountNumber, bank_id: bankId, ...updatedAccount });
});

app.delete('/banks/:bank_id/accounts/:account_number', (req, res) => {
    const bankId = req.params.bank_id;
    const accountNumber = req.params.account_number;

    db.get('accounts')
        .remove({ bank_id: bankId, account_number: accountNumber })
        .write();

    res.sendStatus(204); 
});

app.post('/banks/:bank_id/accounts/:account_number/deposits', (req, res) => {
    const bankId = req.params.bank_id;
    const accountNumber = req.params.account_number;
    const amount = req.body.amount;
    const timestamp = new Date().toISOString();
    const transactionId = generateTransactionId();
    const account = db.get('accounts').find({ bank_id: bankId, account_number: accountNumber }).value();
    const updatedBalance = account.balance + amount;
    db.get('accounts').find({ bank_id: bankId, account_number: accountNumber }).assign({ balance: updatedBalance }).write();

    const deposit = {
        transaction_id: transactionId,
        amount: amount,
        timestamp: timestamp,
        account_number: accountNumber
    };

    res.json(deposit);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});