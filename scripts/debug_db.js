const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

// Manually load .env
const envConfig = dotenv.parse(fs.readFileSync('.env'));
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
    console.log('Checking connection...');
    try {
        const { data, error, count } = await supabase
            .from('daily_linkedin_jobs_report')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Error with daily_linkedin_jobs_report:', error.message);
        } else {
            console.log('daily_linkedin_jobs_report exists, row count:', count);
        }

        const { data: vData, error: vError } = await supabase
            .from('daily_kpi_metrics')
            .select('*')
            .limit(1);

        if (vError) {
            console.error('Error with daily_kpi_metrics view:', vError.message);
        } else {
            console.log('daily_kpi_metrics exists:', vData);
        }
    } catch (err) {
        console.error('Unexpected error:', err.message);
    }
}

check().then(() => process.exit());
