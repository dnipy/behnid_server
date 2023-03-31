import cron from 'node-cron'
import shell from 'shelljs'

// Backup a database at 11:59 PM every day.
cron.schedule('59 23 * * *', function() {
    shell.echo('=-=-=-=-=-=-=-=-=-=-=-=-=-=');
    shell.echo('Database backup started');
    shell.echo('=-=-=-=-=-=-=-=-=-=-=-=-=-=');
    
    if (shell.exec(`pg_dump behnid > ${'behnid_backup_'+Date.now()+'.sql'}`).code !== 0) {
      shell.echo('Database backup exit with error');
      shell.exit(1);
    }
    else {
      shell.echo('Database backup complete');
    }
});