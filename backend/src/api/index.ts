import express from 'express';

import resetDatabase from '@/api/dev/reset_database';
import fetchDetailed from '@/api/path/aur/fetchDetailed';
import fetchPkgbuild from '@/api/path/aur/fetchPkgbuild';
import searchPackage from '@/api/path/aur/searchPackage';
import fetchBuildDetails from '@/api/path/builds/fetchBuildDetails';
import listBuilds from '@/api/path/builds/listBuilds';
import listIssues from '@/api/path/gnupg/listIssues';
import trustKey from '@/api/path/gnupg/trustKey';
import info from '@/api/path/info';
import addPackage from '@/api/path/packages/addPackage';
import listPackages from '@/api/path/packages/listPackages';
import removePackage from '@/api/path/packages/removePackage';

const api = express.Router();

// /api/dev
if (process.env.NODE_ENV === 'development') {
    api.get('/dev/resetDatabase', resetDatabase);
}

// /api/aur
api.get('/aur/fetchPkgbuild/:packageName', fetchPkgbuild);
api.get('/aur/search/:packageName', searchPackage);
api.get('/aur/fetchDetailed/:packageName', fetchDetailed);

// /api/packages
api.get('/packages/list', listPackages);
api.post('/packages/add', addPackage);
api.post('/packages/remove', removePackage);

// /api/builds
api.get('/builds/list', listBuilds);
api.get('/builds/details/:id', fetchBuildDetails);

// /api/info
api.get('/info', info);

// /api/gnupg
api.get('/gnupg/list', listIssues);
api.post('/gnupg/trust', trustKey);

// health check
api.get('/health', (_, res) => {
    res.json({ status: 'ok' });
});

export default api;
