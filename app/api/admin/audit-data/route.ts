import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const guidelines = await db.universityGuideline.findMany();

        const audit = guidelines.map(g => ({
            university: g.university,
            tracks: (g.requirements as any)?.trackInfo?.map((t: any) => ({
                name: t.trackName,
                docs: t.docs
            }))
        }));

        return NextResponse.json({ success: true, audit });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
