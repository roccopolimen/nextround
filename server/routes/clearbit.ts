import express from 'express';
// This is how clearbit does their auth, if you know how to do it with import feel free to change it
import clearbit from 'clearbit' 
import { checkNonEmptyString } from '../helpers/error';
import { CycleObject } from '../typings';
import axios from 'axios';

const router = express.Router();

const secretKey = 'sk_db62884ced11b25efde87b40131fe4da';

// GET /clearbit/:name
router.get('/:name', async (req, res) => {
    if(!checkNonEmptyString(req.params.name)){
        throw new Error('Invalid company name');
    }
    if(!req.headers.authorization)
        return res.status(403).json({ message: 'Unauthorized. Need clearbit api key.' });
    try {
        let companyLogo: Object = (await axios.get(`https://company.clearbit.com/v1/domains/find?name=${req.params.name}`))['logo'];
        console.log(companyLogo);
        return res.json(companyLogo);
    } catch(e) {
        return res.status(500).json({ 
            message: 'Internal Server Error. Failed to get current company logo.',
            error: e.message });
    }
});

export default router;