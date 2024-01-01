const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');

router.post('/create', notesController.createNote)
router.get('/notes', notesController.readNotes);
router.put('/update/:noteId', notesController.updateNote);
router.delete('/delete/:noteId', notesController.deleteNote);

module.exports = router;
