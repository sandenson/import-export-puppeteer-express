import express from 'express';
import multer from 'multer';
const upload = multer()
// const upload = multer({ dest: 'uploads/' })

import { UserController } from './controllers/userController';
import { ProfileController } from './controllers/ProfileController';

const router = express();

router.get('/users', UserController.findAll);
router.get('/users/:email', UserController.findOne);
router.get('/users/stealth/:email/:viewport', UserController.stealth);
router.get('/users/export/:email', UserController.export);
router.post('/users', UserController.create);
router.post('/users/import', upload.single('zip'), UserController.import);
router.delete('/users/:email', UserController.delete);
  
router.get('/profiles', ProfileController.findAll);
router.get('/profiles/:id', ProfileController.findOne);
router.get('/profiles/stealth/:id/:viewport', ProfileController.stealth);
router.get('/profiles/export/:id', ProfileController.export);
router.post('/profiles', ProfileController.create);
router.post('/profiles/import', upload.single('zip'), ProfileController.import);
router.delete('/profiles/:id', ProfileController.delete);

export default router;
