#!/usr/bin/env node

import { installLinting } from './index';

const cwd = process.argv[2] || '.';

installLinting(cwd);
