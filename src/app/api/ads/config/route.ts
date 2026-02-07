import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const config = await request.json();

        // Path to ads.json
        const configPath = path.join(process.cwd(), 'src', 'config', 'ads.json');

        // Write updated config
        await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');

        return NextResponse.json({ success: true, message: 'Configuração salva com sucesso!' });
    } catch (error) {
        console.error('Error saving ads config:', error);
        return NextResponse.json(
            { success: false, message: 'Erro ao salvar configuração' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const configPath = path.join(process.cwd(), 'src', 'config', 'ads.json');
        const content = await fs.readFile(configPath, 'utf-8');
        const config = JSON.parse(content);

        return NextResponse.json(config);
    } catch (error) {
        console.error('Error reading ads config:', error);
        return NextResponse.json(
            { success: false, message: 'Erro ao ler configuração' },
            { status: 500 }
        );
    }
}
