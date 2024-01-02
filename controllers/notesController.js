const Note = require('../models/notes');
const logger = require('../utils/logger');
const uuid = require('uuid4');

const createNote = async (req, res) => {
    logger.info("CreateNote API gets called.");
    const { title, content } = req.body;
    const userId = req.decoded.userId;

    if (!title || !content) {

        logger.error("CreateNote: All fields are required, Request Body", req.body)
        code = 400;
        resBody = {
            message: 'All fields are required'
        };

    } else if (title.length > 64 || content.length > 256) {
        logger.error("Max characters allowed for title or content exceeded.(Max characters for title is 64 and for content is 256)", req.body)
        code = 400;
        resBody = {
            message: 'Max characters allowed for title or content exceeded.(Max characters for title is 64 and for content is 256)'
        };
    } else {


        try {

            const note = new Note();

            note._id = uuid();
            note.userId = userId;
            note.title = title;
            note.content = content;
            note.lastUpdatedAt = Date.now()

            await note.save();

            code = 201;
            resBody = {
                message: "Note created Successfully.",
                metaInfo: {
                    noteId: note._id,
                }
            };

        } catch (e) {
            logger.error(e.message);
            code = 500;
            resBody = {
                message: "An error has occured.",
                error: e.message,
            };
        }
    }

    res.status(code).json(resBody);
}


const readNotes = async (req, res) => {
    logger.info("Read Note API gets called.");
    const noteId = req.query.noteid || false;
    const userId = req.decoded.userId;
    if (noteId) {
        logger.info("noteId Found, retrieving specific note with noteId: " + noteId);
        try {
            const noteDocs = await Note.find({ '_id': noteId, 'userId': userId });

            if(noteDocs.length == 0){
                logger.info("no Document Exist or got deleted for noteId: " + noteId);
                code = 409;
                resBody = {
                    message: "no Document Exist or got deleted for noteId: " + noteId,
                };
            }else{
                let [noteDoc] = noteDocs
                code = 200;
                resBody = {
                    title: noteDoc.title,
                    content: noteDoc.content,
                    lastUpdatedOn: noteDoc.lastUpdatedAt,
                    createdAt: noteDoc.createdAt
                }
                logger.info("Successfully, retrieved specific note from DB.");
            }
            
        } catch (e) {
            logger.error(e.message);
            code = 500;
            resBody = {
                message: "An error has occured.",
                error: e.message,
            };
        }

    } else {
        try {

            logger.info("noteId not Found, retrieving all notes for userId: " + userId);
            const noteDocs = await Note.find({ 'userId': userId }, { '_id': 1, 'title': 1, });

            if (noteDocs.length == 0) {
                logger.info("No Notes Exist in DB for user.");
                code = 200;
                resBody = {
                    message: "No Notes Exist for User.",
                };
            } else {

                logger.info("All Notes for user retrieved successfully.");
                code = 200;
                resBody = {
                    message: "All Notes for user retrieved successfully.",
                    notes: noteDocs,
                };
            }

        } catch (e) {
            logger.error(e.message);
            code = 500;
            resBody = {
                message: "An error has occured.",
                error: e.message,
            };
        }
    }
    res.status(code).json(resBody);
}


const updateNote = async (req, res) => {
    logger.info("Update Note API gets called.")
    let code, resBody;
    const noteId = req.params.noteId;
    const { title, content } = req.body;
    const userId = req.decoded.userId;

    if (!title && !content) {
        logger.error("Atleast one field is required")
        code = 422;
        resBody = {
            message: 'Atleast one field is required.'
        };

    } else if ((title && title.length > 64) || (content && content.length > 256)) {
        logger.error("Max characters allowed for title or content exceeded.(Max characters for title is 64 and for content is 256), Request Body", req.body)
        code = 400;
        resBody = {
            message: 'Max characters allowed for title or content exceeded.(Max characters for title is 64 and for content is 256)'
        };

    } else {
        try {


            if (noteId) {
                let filter = { '_id': noteId, 'userId': userId }
                let update = {};
                const noteDocs = await Note.find(filter);
                if (noteDocs.length == 0) {
                    code = 409;
                    resBody = {
                        message: "No note document exist with noteId and userId combination.",
                    };
                    return res.status(code).json(resBody);
                }

                if (title) update.title = title;
                if (content) update.content = content;
                await Note.findOneAndUpdate(filter, update);

                let [updatedDoc] = await Note.find(filter);

                code = 200;
                resBody = {
                    message: "Note info updated successfully.",
                    updatedNote: {
                        title: updatedDoc.title,
                        content: updatedDoc.content
                    },
                };
            } else {
                code = 404;
                resBody = {
                    message: "noteId not provided.",
                };
            }

        } catch (e) {
            logger.error(e.message);
            code = 500;
            resBody = {
                message: "Error occured while updating note's details.",
                error: e.message,
            }
        }
    }
    res.status(code).json(resBody);

};


//delete Note
const deleteNote = async (req, res) => {
    let code, resBody;
    const noteId = req.params.noteId;
    const userId = req.decoded.userId;
    try {
        const filter = { '_id': noteId, 'userId': userId }
        const noteDocs = await Note.find(filter);
        if (noteDocs.length == 0) {
            code = 409;
            resBody = {
                message: "no document Exists with noteId and userId combo."
            };
            return res.status(code).json(resBody);
        }
        code = 200;
        resBody = {
            message: "Successfully deleted note document.",
            metaInfo: {
                'noteId': noteId
            }
        };
        await Note.deleteOne(filter);

    } catch (e) {
        logger.error(e.message);
        code = 500;
        resBody = {
            message: "Error occured while fetching note document from db.",
            error: e.message,
        };
    }

    res.status(code).json(resBody);

};


module.exports = {
    createNote,
    readNotes,
    updateNote,
    deleteNote,
};
