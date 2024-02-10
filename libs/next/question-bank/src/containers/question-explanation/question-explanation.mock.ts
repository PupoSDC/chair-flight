import type { AppRouterOutput } from "@chair-flight/trpc/server";

export const mockData: AppRouterOutput["containers"]["questions"]["getQuestionExplanation"] =
  {
    explanation: {
      content:
        '"use strict";\nconst {Fragment: _Fragment, jsx: _jsx, jsxs: _jsxs} = arguments[0];\nconst {useMDXComponents: _provideComponents} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    hr: "hr",\n    li: "li",\n    ul: "ul",\n    ..._provideComponents(),\n    ...props.components\n  };\n  return _jsxs(_Fragment, {\n    children: [_jsx(_components.hr, {}), "\\n", _jsxs(_components.ul, {\n      children: ["\\n", _jsx(_components.li, {\n        children: "The A/T automatically disengages approximately 2 seconds after touchdown."\n      }), "\\n", _jsx(_components.li, {\n        children: "the A/P must be manually disengaged after touchdown. Landing roll-out is executed manually after disengaging the A/P."\n      }), "\\n"]\n    })]\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = {\n    ..._provideComponents(),\n    ...props.components\n  };\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\n',
    },
  };
