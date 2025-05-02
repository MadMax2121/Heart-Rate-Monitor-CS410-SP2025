import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

let latestBody: any = null;

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    latestBody = raw;

    // Normalize key to always use 'heartRate'
    const heartRate = raw.heartRate ?? raw.heartRateData;
    if (!heartRate || !raw.timestamp) {
      return NextResponse.json({ error: 'Missing heartRate or timestamp' }, { status: 400 });
    }

    const cleanData = {
      userId: raw.userId,
      deviceId: raw.deviceId,
      timestamp: raw.timestamp,
      heartRate: heartRate
    };

    const { data, error } = await supabase
      .from('heart_rate_data')
      .insert([{ data: cleanData, created_at: new Date().toISOString() }]);

    if (error) {
      console.error('Error storing data in Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'received' }, { status: 200 });
  } catch (error: any) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const latestData = { body: latestBody };

    const { data: recentRequests, error } = await supabase
      .from('heart_rate_data')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching data from Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      latest: latestData.body,
      recentRequests
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET request:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
