const fs = require('fs');
fs.copyFileSync('config/hooks/pre-commit', '.git/hooks/pre-commit');
