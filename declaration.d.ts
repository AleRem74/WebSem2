// declarations.d.ts 
import 'express'; // импортировать 'express' для расширения его типов
import { User } from './src/models/User'; 

declare module 'express' {
  interface Request {
    user?: User; 
  }
}
