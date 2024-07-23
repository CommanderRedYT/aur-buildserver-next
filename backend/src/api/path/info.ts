import type { Request, Response } from 'express';

import { successResponse } from '@/helper/api';
import { getSigningKeyId } from '@/pacman/repo';

export default async function info(req: Request, res: Response): Promise<void> {
    const signingKeyId = await getSigningKeyId();

    successResponse<'/api/info'>(res, {
        signingKeyId,
    });
}
