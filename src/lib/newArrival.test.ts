import { describe, expect, it } from 'vitest';
import { isNewArrival } from './newArrival';
describe('isNewArrival',()=>{it('shows only the first 30 calendar days',()=>{const today=new Date('2026-09-08T00:00:00Z');expect(isNewArrival('2026-08-10T00:00:00Z',today)).toBe(true);expect(isNewArrival('2026-08-09T00:00:00Z',today)).toBe(false)})});
