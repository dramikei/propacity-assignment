import { Router } from 'express';
import Controllers from '../../controller';
import { Boom } from '@hapi/boom';
const router = Router();

router.get('/me', async (req, res) => {
    // Get user details
    Controllers.usersController.getUserDetails('');
});

router.post('/signup', async (req, res) => {
    // Create user
    const body = req.body;
    const data = await Controllers.usersController.createUser(body);
    res.json(data);
});

export default router;