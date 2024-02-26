
/**
 * From https://github.com/michal-wrzosek/cntl
 * 
 * allows to write tailwind classes in a way that won't drive me insane.
 */
export function cntl(template: TemplateStringsArray, ...templateElements: unknown[]) {
    return template
      .reduce((sum, n, index) => {
        const templateElement = templateElements[index];
        if (typeof templateElement === 'string') {
          return `${sum}${n}${templateElement}`;
        }
        return `${sum}${n}`;
      }, '')
      .trim()
      .replace(/\s{2,}/g, ' ');
  }