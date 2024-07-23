'use server';

import { cookies } from 'next/headers';

export async function createDarkmodeCookie(
    enableDarkmode: boolean,
): Promise<void> {
    const cookieStore = cookies();

    const darkModeCookie = cookieStore.get('darkMode')?.value;

    if (darkModeCookie === undefined) {
        cookieStore.set('darkMode', enableDarkmode ? 'true' : 'false');
    }
}
