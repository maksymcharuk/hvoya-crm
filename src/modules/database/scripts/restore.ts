import { DatabaseService } from '../services/database.service';

console.log('Restoring database...');
DatabaseService.restore()
  .then(() => {
    console.log('Database restored successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to restore database!', error);
    process.exit(1);
  });
