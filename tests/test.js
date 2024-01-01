const request = require('supertest');
const logger = require('../utils/logger')
const app = require('../app.js');
const ENDPOINTS = {
    REGISTER_USER: '/api/auth-service/register',
    LOGIN_USER: '/api/auth-service/login',
    LOGOUT_USER: '/api/auth-service/logout',
    TEST_USER_CLEAN_UP: '/api/auth-service/cleanup',
    CREATE_NOTE: '/api/notes-service/create',
    READ_NOTE: '/api/notes-service/notes',
    UPDATE_NOTE: '/api/notes-service/update/{{noteId}}',
    DELETE_NOTE: '/api/notes-service/delete/{{noteId}}',
};


describe('E2E Testing', () => {
    let userInfo = {
        username: 'NotesAppTestUser',
        password: 'testuser123'
    };
    it('Test User Clean-UP', async () => {
        const resp = await request(app).get(ENDPOINTS.TEST_USER_CLEAN_UP);
        expect(resp.body).toHaveProperty('message');
    });
    it('Register User', async () => {
        const resp = await request(app).post(ENDPOINTS.REGISTER_USER).send(userInfo);
        expect(resp.status).toBe(201);
        expect(resp.body).toHaveProperty('userInfo');
    });
    let authToken;
    it('Login User', async () => {
        const resp = await request(app).post(ENDPOINTS.LOGIN_USER).send(userInfo);
        expect(resp.status).toBe(200);
        expect(resp.body).toHaveProperty('token');
        authToken = resp.body.token;
        logger.info("Auth Token: " + authToken)

    });

    let testNotes = [
        {
            title: "test-title-1",
            content: "test-content-1",
        },
        {
            title: "test-title-2",
            content: "test-content-1",
        },
        {
            title: "test-title-3",
            content: "test-content-1",
        },
    ];
    it('Test Create Note', async () => {

        for (let i = 0; i < testNotes.length; i++) {
            const resp = await request(app).post(ENDPOINTS.CREATE_NOTE).set('Authorization', `Bearer ${authToken}`).send(testNotes[i]);
            expect(resp.status).toBe(201);
            expect(resp.body).toHaveProperty('metaInfo');
            testNotes[i].noteId = resp.body.metaInfo.noteId
        }

    });
    it('Test Read Note', async () => {

        for (let i = 0; i < testNotes.length; i++) {
            let READ_NOTE_ENDPOINT = ENDPOINTS.READ_NOTE + "?noteid=" + testNotes[i].noteId;
            logger.info(READ_NOTE_ENDPOINT)
            let resp = await request(app).get(READ_NOTE_ENDPOINT).set('Authorization', `Bearer ${authToken}`);
            expect(resp.status).toBe(200);
            logger.info("NoteInfo: ", resp.body)
            expect(resp.body).toHaveProperty('title');
            expect(resp.body.title).toBe(testNotes[i].title);
            expect(resp.body).toHaveProperty('content');
            expect(resp.body.content).toBe(testNotes[i].content);
        }

        logger.info("Check For reading all notes")
        let resp = await request(app).get(ENDPOINTS.READ_NOTE).set('Authorization', `Bearer ${authToken}`);
        expect(resp.status).toBe(200);
        expect(resp.body).toHaveProperty('notes');
        let notes = resp.body.notes;
        expect(notes).toBeInstanceOf(Array);
        expect(notes.length).toBe(testNotes.length);
        logger.info("Notes Retrieved" + JSON.stringify(notes));
        

    });

    it('Test Update Note', async () => {
        testNotes[0].title += "updated";
        testNotes[0].content += "updated"
        let UPDATE_NOTE_ENDPOINT = ENDPOINTS.UPDATE_NOTE.replace("{{noteId}}", testNotes[0].noteId)
        let resp = await request(app).put(UPDATE_NOTE_ENDPOINT).set('Authorization', `Bearer ${authToken}`).send(testNotes[0]);
        expect(resp.status).toBe(200);
        expect(resp.body).toHaveProperty('updatedNote');
        expect(resp.body.updatedNote.title).toBe(testNotes[0].title);
        expect(resp.body.updatedNote.content).toBe(testNotes[0].content);

    });
    it('Test Delete Note', async () => {


        let DELETE_NOTE_ENDPOINT = ENDPOINTS.DELETE_NOTE.replace("{{noteId}}", testNotes[2].noteId)
        let resp = await request(app).delete(DELETE_NOTE_ENDPOINT).set('Authorization', `Bearer ${authToken}`);
        expect(resp.status).toBe(200);
        expect(resp.body).toHaveProperty('metaInfo');
        expect(resp.body.metaInfo.noteId).toBe(testNotes[2].noteId);

    });

    it('Test User Logout', async () => {

        let resp = await request(app).get(ENDPOINTS.LOGOUT_USER).set('Authorization', `Bearer ${authToken}`);
        expect(resp.status).toBe(200);

    });

});
