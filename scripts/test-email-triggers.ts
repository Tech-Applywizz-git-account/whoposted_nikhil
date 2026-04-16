import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase URL or Service Role Key in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testInvite(email: string) {
  console.log(`Sending invite to ${email}...`);
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);
  if (error) {
    console.error('Error sending invite:', error);
  } else {
    console.log('Invite sent successfully:', data);
  }
}

async function testReset(email: string) {
  console.log(`Sending password reset to ${email}...`);
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    console.error('Error sending reset password:', error);
  } else {
    console.log('Reset password email sent successfully:', data);
  }
}

async function main() {
  const email = process.argv[2];
  const type = process.argv[3];

  if (!email) {
    console.log('Usage: npx tsx scripts/test-email-triggers.ts <email> <invite|reset>');
    return;
  }

  if (type === 'invite') {
    await testInvite(email);
  } else if (type === 'reset') {
    await testReset(email);
  } else {
    console.log('Please specify type: invite or reset');
  }
}

main();
