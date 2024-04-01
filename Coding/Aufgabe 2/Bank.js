const express = require('express');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
const PORT = 3000;

// Verbindung zur Datenbank herstellen
const adapter = new FileSync('db.json');
const db = low(adapter);

// Datenbank initialisieren (falls noch nicht vorhanden)
db.defaults({ banks: [], accounts: [], deposits: [], withdrawals: [] }).write();

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

// Weitere API-Endpunkte für Konten
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

// Weitere API-Endpunkte für Einzahlungen und Abhebungen hier hinzufügen...

// Start des Servers
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});