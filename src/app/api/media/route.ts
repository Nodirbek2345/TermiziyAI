import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

// GET: List all images from 'termiziy-ai' folder
export async function GET() {
    try {
        const { resources } = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'termiziy-ai', // Optional: Folder prefix
            max_results: 50,
        });

        return NextResponse.json({ success: true, resources });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST: Upload an image
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary using promise wrapper
        const result = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'termiziy-ai', resource_type: 'auto' },
                (error: any, result: any) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
