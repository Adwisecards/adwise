import * as path from 'path';
import { Config } from './implementation/Config';

const configPath = path.join(__dirname, '..', '..', '..', '..', '.env');
const config = new Config(configPath);

export const configProps = config.load();