const fs = require('fs');
const path = './src/environments/environment.prod.ts';

const envContent = `
export const environment = {
  production: true,
  baseUrl: '${process.env.BASE_URL || ''}',
  apiKey: '${process.env.API_KEY || ''}'
};
`;

fs.writeFileSync(path, envContent);
console.log('✅ environment.prod.ts generado correctamente');
