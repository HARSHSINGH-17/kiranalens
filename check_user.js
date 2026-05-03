const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jbjjhcxiwzgvuuczeiiy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpieWpqY2h4aXd6Z3Z1dWN6ZWlpeSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzE0NzMwMTQzLCJleHAiOjIwMzAyODYxNDN9.4S88W_rX1zM2NjM4NX0.13KRnh3frCYaXkjA5e16gw6cwrVEX3eEH7GWLOGyzkk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUser() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', 'demo@kiranalens.com')
    .single();

  if (error) {
    console.error('Error finding demo user:', error.message);
  } else {
    console.log('Demo user found:', data.email);
  }
}

checkUser();
