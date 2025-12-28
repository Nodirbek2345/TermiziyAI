import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'src', 'config', 'settings.json');

function getSettings() {
    if (!fs.existsSync(settingsPath)) {
        return { frontendMode: false, layoutLock: false };
    }
    const fileContent = fs.readFileSync(settingsPath, 'utf-8');
    return JSON.parse(fileContent);
}

function saveSettings(settings: any) {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

export async function GET() {
    try {
        const settings = getSettings();
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const currentSettings = getSettings();
        const newSettings = { ...currentSettings, ...body };

        saveSettings(newSettings);

        return NextResponse.json({ success: true, settings: newSettings });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
