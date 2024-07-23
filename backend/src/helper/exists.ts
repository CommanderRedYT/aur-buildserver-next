import fs from 'fs/promises';

const exists = async (path: string): Promise<boolean> => fs.stat(path).then(() => true).catch(() => false);

export default exists;
