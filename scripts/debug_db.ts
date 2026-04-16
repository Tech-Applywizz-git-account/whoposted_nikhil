import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
    const { data, error } = await supabase
        .from('daily_linkedin_jobs_report')
        .select('count', { count: 'exact', head: true });

    if (error) {
        console.error('Error with daily_linkedin_jobs_report:', error);
    } else {
        console.log('daily_linkedin_jobs_report exists, count:', data);
    }

    const { data: vData, error: vError } = await supabase
        .from('daily_kpi_metrics')
        .select('*')
        .limit(1);

    if (vError) {
        console.error('Error with daily_kpi_metrics view:', vError);
    } else {
        console.log('daily_kpi_metrics exists:', vData);
    }
}

check();
