import { exec } from 'child_process';
import type { Request, Response } from 'express';

export default async function resetDatabase(req: Request, res: Response): Promise<void> {
    res.setHeader('Content-Type', 'text/plain');
    res.write('Resetting database...\n');

    exec('DEBUG="" yarn prisma migrate reset --force', (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error.message}`);
            res.write(`error: ${error.message}`);
            res.status(500).end();
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            res.write(`stderr: ${stderr}`);
            res.status(500).end();
            return;
        }
        console.log(`stdout: ${stdout}`);
        res.write(`stdout: ${stdout}`);
        res.status(200).end();
    });
}
