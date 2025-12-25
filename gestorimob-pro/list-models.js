
import fetch from 'node-fetch';

const API_KEY = 'AIzaSyCzdZdW3lColYRBluzYVhYKq93_sqPw9wU';
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function listModels() {
  console.log('Listing models...');
  try {
    const response = await fetch(URL);
    const data = await response.json();
    
    if (response.ok) {
        console.log('✅ Models found:');
        data.models.forEach(m => {
            if(m.name.includes('gemini')) console.log(m.name);
        });
    } else {
        console.log('❌ Error listing models:');
        console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Exception:', error);
  }
}

listModels();
