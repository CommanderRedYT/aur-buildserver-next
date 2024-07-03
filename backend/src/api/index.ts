import express from 'express';

import fetchPkgbuild from '@/api/path/aur/fetchPkgbuild';
import searchPackage from '@/api/path/aur/searchPackage';
import addPackage from '@/api/path/packages/addPackage';
import listPackages from '@/api/path/packages/listPackages';

const api = express.Router();

// /api/aur
api.get('/aur/fetchPkgbuild/:packageName', fetchPkgbuild);
api.get('/aur/search/:packageName', searchPackage);

// /api/packages
api.get('/packages/list', listPackages);
api.post('/packages/add', addPackage);

export default api;
