import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function DELETE(
    request: Request,
    { params }: { params: { public_id: string } }
) {
    try {
        const public_id = params.public_id;

        if (!public_id) {
            return NextResponse.json({ success: false, error: 'Public ID is required' }, { status: 400 });
        }

        // Decode URL component if it was encoded (often public_id has slashes)
        // Wait, params are auto-decoded by Next.js usually, but slashes in public_id might be tricky with simple [public_id] route.
        // Cloudinary public_ids often look like "folder/image".
        // If I use catch-all route `[...path]`, it might be safer, but I'll stick to simple param and expect frontend to pass the ID correctly or as separate query param?
        // Actually, slashes in URL params in Next.js app directory [slug] causes issues if not encoded.
        // A safer way for DELETE is to pass public_id in the body or query param of the main route.

        // REVISION: I will use the main route DELETE with body/query instead of dynamic route to avoid slash issues.
        // But the user plan said `[public_id]`.
        // Let's stick to the plan but encoded.
        // Actually, I will write the dynamic route but handle decoding.

        const decodedId = decodeURIComponent(public_id);

        const result = await cloudinary.uploader.destroy(decodedId); // or "termiziy-ai/"+decodedId if passed relatively

        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
