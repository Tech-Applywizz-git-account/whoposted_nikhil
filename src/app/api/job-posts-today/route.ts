import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL; // Frontend URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Server-side key

// Log to verify if Supabase credentials are correctly loaded
console.log('SUPABASE_URL:', SUPABASE_URL);
console.log('SUPABASE_KEY:', SUPABASE_KEY);

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Supabase URL or Key is missing!');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get('date');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    let startDate: string;
    let endDate: string;

    if (startDateParam && endDateParam) {
      startDate = startDateParam;
      endDate = endDateParam;
    } else {
      // Use IST (UTC+5:30) so "today" is correct regardless of server timezone
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istNow = new Date(Date.now() + istOffset);
      const todayIST = istNow.toISOString().split('T')[0];
      const targetDate = (dateParam === 'today' || !dateParam) ? todayIST : dateParam;
      startDate = targetDate;
      endDate = targetDate;
    }

    console.log(`Fetching job posts count for range: ${startDate} to ${endDate}`);

    // Query to count jobs posted within the range
    const { error, count } = await supabase
      .from('daily_linkedin_jobs_report')
      .select('*', { count: 'exact', head: true })
      .gte('report_date', startDate)
      .lte('report_date', endDate);

    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }

    console.log(`Jobs posted between ${startDate} and ${endDate}:`, count || 0);

    return new Response(JSON.stringify({
      job_posts_today: count || 0,
      date_queried: startDate
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error fetching job posts:", error);

    // Type guard to check if error has a message property
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return new Response(JSON.stringify({
      error: 'Error fetching job posts',
      details: errorMessage
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}