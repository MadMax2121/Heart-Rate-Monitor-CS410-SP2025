import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

let latestBody: any = null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    latestBody = body;
    
    // Store the request in Supabase
    const { data, error } = await supabase
      .from('heart_rate_data')
      .insert([
        { 
          data: body,
          created_at: new Date().toISOString()
        }
      ]);
    
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
    // Get latest data for backward compatibility
    const latestData = { body: latestBody };
    
    // Get the last 5 requests from Supabase
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