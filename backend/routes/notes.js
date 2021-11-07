const express = require("express");
const router = express.Router();
const fetchuser = require('../middlewares/fetchuser');
const Note = require("../models/Note");
const { body, validationResult } = require('express-validator');


// ROUTE 1: Get all notes of user using: GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.send(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// ROUTE 2: Add a note of user using: POST "/api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Enter a valid description').isLength({ min: 5 })
], async (req, res) => {

    try {
        // return bad request and error if exists
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
        }
        const { title, description, tag } = req.body;

        const note = new Note({
            title,
            description,
            tag,
            user: req.user.id
        })

        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// ROUTE 2: Updating an existing note using: PUT "/api/notes/updatenote". Login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {

    try {
        const { title, description, tag } = req.body;

        const newNote = {};
        if (title) newNote.title = title;
        if (description) newNote.description = description;
        if (tag) newNote.tag = tag;

        // find a note using using id given by user
        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).send("Note Not Found!")
        }

        // Check if user owns the note or not
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed!");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
})

// ROUTE 2: Deleting an existing note using: DELETE "/api/notes/deletenote". Login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        // find a note using using id given by user
        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).send("Note Not Found!")
        }

        // Check if user owns the note or not
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed!");
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ Success: "Note Deleted Successfully" });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = router;