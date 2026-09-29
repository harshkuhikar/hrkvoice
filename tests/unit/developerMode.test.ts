import { describe, it, expect } from 'vitest';
import { DeveloperFormatter } from '../../packages/ai/src/pipeline/developerFormatter';

describe('Developer Mode Formatter Unit Tests', () => {
  it('should transform spoken component name into PascalCase', () => {
    const input = 'create a component called user profile card';
    const res = DeveloperFormatter.formatDeveloperSpeech(input);
    expect(res.formatted).toBe('UserProfileCard');
    expect(res.changed).toBe(true);
  });

  it('should transform spoken React hook into camelCase', () => {
    const input = 'create a use effect hook';
    const res = DeveloperFormatter.formatDeveloperSpeech(input);
    expect(res.formatted).toBe('useEffect');
  });

  it('should transform spoken npm package command into kebab-case package', () => {
    const input = 'npm install react router dom';
    const res = DeveloperFormatter.formatDeveloperSpeech(input);
    expect(res.formatted).toBe('npm install react-router-dom');
  });

  it('should transform spoken constant into UPPER_SNAKE_CASE', () => {
    const input = 'constant api base url equals localhost';
    const res = DeveloperFormatter.formatDeveloperSpeech(input);
    expect(res.formatted).toContain('API_BASE_URL');
  });

  it('should format git commit message correctly', () => {
    const input = 'git commit message initial commit for voice engine';
    const res = DeveloperFormatter.formatDeveloperSpeech(input);
    expect(res.formatted).toBe('git commit -m "initial commit for voice engine"');
  });
});
