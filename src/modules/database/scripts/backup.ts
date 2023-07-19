import { DatabaseService } from '../services/database.service';

console.log('Backing up database...');
DatabaseService.backup()
  .then(() => {
    console.log('Database backed up successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to backup database!', error);
    process.exit(1);
  });
