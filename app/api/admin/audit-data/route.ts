import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const guidelines = await db.universityGuideline.findMany({
            select: {
                id: true,
                university: true,
                major: true,
                requirements: true
            }
        });

        const audit = guidelines.map(g => ({
            id: g.id,
            university: g.university,
            major: g.major,
            extractedUniversity: (g.requirements as any)?.university
        }));

        return NextResponse.json({ success: true, audit });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
