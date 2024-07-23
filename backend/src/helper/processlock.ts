// eslint-disable-next-line max-classes-per-file
export class ProcessLockTimeoutError extends Error {
    constructor(lockedBy: string, currentlyLockedBy: string) {
        super(`Could not acquire lock in specified time for ${lockedBy}, already locked by ${currentlyLockedBy}`);
    }
}

export type UnlockFunction = (() => void);

class ProcessLock {
    private locked: boolean = false;
    private lockedBy: string | null = null;

    public isLocked(): boolean {
        return this.locked;
    }

    public forceUnlock(): void {
        this.locked = false;
        this.lockedBy = null;
    }

    public tryToLock(timeoutMillis: number, lockedBy: string): Promise<UnlockFunction> {
        console.log('Trying to lock', lockedBy);
        const unlockFunction = (): void => {
            if (this.lockedBy !== lockedBy) {
                console.error('Tried to unlock with wrong lock owner', lockedBy, this.lockedBy);
                return;
            }

            console.log('Lock released', lockedBy);

            this.locked = false;
            this.lockedBy = null;
        };

        return new Promise<UnlockFunction>((resolve, reject) => {
            if (!this.locked) {
                console.log('Lock acquired', lockedBy);

                this.locked = true;
                this.lockedBy = lockedBy;
                resolve(unlockFunction);
                return;
            }

            const interval = setInterval(() => {
                // TODO: Better logging
                // console.log('Trying to acquire lock', `this.locked=${this.locked}, this.lockedBy=${this.lockedBy}, lockedBy=${lockedBy}`);
                if (!this.locked) {
                    console.log('Lock acquired', lockedBy);

                    this.locked = true;
                    this.lockedBy = lockedBy;
                    clearInterval(interval);
                    resolve(unlockFunction);
                }
            }, 100);
            setTimeout(() => {
                clearInterval(interval);
                reject(new ProcessLockTimeoutError(lockedBy, this.lockedBy || 'unknown'));
            }, timeoutMillis);
        });
    }
}

export default ProcessLock;
