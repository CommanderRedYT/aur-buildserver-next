import { exec } from 'child_process';

const programExists = async (program: string): Promise<boolean> => new Promise<boolean>((resolve) => {
    exec(`which ${program}`, (error) => {
        resolve(!error);
    });
});

export default programExists;
