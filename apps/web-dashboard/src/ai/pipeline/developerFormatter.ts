/**
 * Developer Mode Transformation Rules for HRKVoice
 * Accurately formats code identifiers, package names, and CLI commands.
 */

export class DeveloperFormatter {
  public static toCamelCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[A-Z]/, c => c.toLowerCase());
  }

  public static toPascalCase(str: string): string {
    const camel = this.toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  }

  public static toSnakeCase(str: string): string {
    return str
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  public static toKebabCase(str: string): string {
    return str
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  public static toConstantCase(str: string): string {
    return this.toSnakeCase(str).toUpperCase();
  }

  /**
   * Apply developer mode transformations to spoken phrases
   */
  public static formatDeveloperSpeech(text: string): { formatted: string; changed: boolean } {
    if (!text) return { formatted: '', changed: false };
    let current = text;
    let changed = false;

    // 1. "create a component called [name]" -> PascalCase (e.g. UserProfileCard)
    const componentRegex = /\b(?:create\s+(?:a\s+)?component\s+(?:called\s+)?)([a-zA-Z0-9\s]+?)(?=(?:\s+(?:with|that|in|and)\b)|\s*$)/i;
    const compMatch = current.match(componentRegex);
    if (compMatch) {
      const rawName = compMatch[1].trim();
      const pascal = this.toPascalCase(rawName);
      current = current.replace(compMatch[0], pascal);
      changed = true;
    }

    // 2. React hooks: "create a use [name] hook" -> "use[Name]"
    const hookRegex = /\b(?:create\s+(?:a\s+)?)?(use\s+[a-zA-Z0-9]+)\s+hook\b/i;
    const hookMatch = current.match(hookRegex);
    if (hookMatch) {
      const hookName = this.toCamelCase(hookMatch[1]);
      current = current.replace(hookMatch[0], hookName);
      changed = true;
    }

    // 3. Functions: "create a function [name]" -> "function [name]()" or camelCase
    const funcRegex = /\b(?:create\s+(?:a\s+)?function\s+(?:called\s+)?)([a-zA-Z0-9\s]+?)(?=\s+(?:with|that|in|and|$))/i;
    const funcMatch = current.match(funcRegex);
    if (funcMatch) {
      const camel = this.toCamelCase(funcMatch[1].trim());
      current = current.replace(funcMatch[0], camel);
      changed = true;
    }

    // 4. Variables: "variable [name]" or "constant [name]"
    const constRegex = /\b(?:constant|const)\s+([a-zA-Z0-9\s]+?)(?=\s+(?:equals|is|with|$))/i;
    const constMatch = current.match(constRegex);
    if (constMatch) {
      const upper = this.toConstantCase(constMatch[1].trim());
      current = current.replace(constMatch[0], upper);
      changed = true;
    }

    // 5. Package managers: "npm install react router dom" -> "npm install react-router-dom"
    const npmRegex = /\b(npm\s+i(?:nstall)?|yarn\s+add|pnpm\s+add)\s+([a-zA-Z0-9\s-]+)/i;
    const npmMatch = current.match(npmRegex);
    if (npmMatch) {
      const cmd = npmMatch[1];
      const pkgs = npmMatch[2]
        .trim()
        .split(/\s+/)
        .map(p => p.toLowerCase());
      // Join multi-word package common phrases (e.g. react router dom -> react-router-dom)
      let joinedPkgs = pkgs.join(' ');
      joinedPkgs = joinedPkgs.replace(/react\s+router\s+dom/g, 'react-router-dom');
      joinedPkgs = joinedPkgs.replace(/tailwind\s+css/g, 'tailwindcss');
      joinedPkgs = joinedPkgs.replace(/lucide\s+react/g, 'lucide-react');
      current = current.replace(npmMatch[0], `${cmd} ${joinedPkgs}`);
      changed = true;
    }

    // 6. Common git commands
    current = current.replace(/\bgit\s+commit\s+message\s+(.+)$/i, 'git commit -m "$1"');
    current = current.replace(/\bgit\s+checkout\s+branch\s+([a-zA-Z0-9-_]+)/i, 'git checkout -b $1');

    return { formatted: current.trim(), changed };
  }
}
