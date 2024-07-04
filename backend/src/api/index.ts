import express from 'express';

import resetDatabase from '@/api/dev/reset_database';
import fetchPkgbuild from '@/api/path/aur/fetchPkgbuild';
import searchPackage from '@/api/path/aur/searchPackage';
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

// /api/packages
api.get('/packages/list', listPackages);
api.post('/packages/add', addPackage);
api.post('/packages/remove', removePackage);

export default api;
