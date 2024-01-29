import type { AppRouterOutput } from "@chair-flight/trpc/server";

export const mockData: AppRouterOutput["containers"]["blog"]["getBlogPost"] = {
  post: {
    mdxContent: {
      content:
        '"use strict";\nconst {Fragment: _Fragment, jsx: _jsx, jsxs: _jsxs} = arguments[0];\nconst {useMDXComponents: _provideComponents} = arguments[0];\nfunction _createMdxContent(props) {\n  const _components = {\n    p: "p",\n    ..._provideComponents(),\n    ...props.components\n  }, {BugReportButton, Stack} = _components;\n  if (!BugReportButton) _missingMdxReference("BugReportButton", true);\n  if (!Stack) _missingMdxReference("Stack", true);\n  return _jsxs(_Fragment, {\n    children: [_jsx(_components.p, {\n      children: "In order to make it easier for you to report issues with Chair Flight, we\\nhave added a new button in the top right corner to all our pages. With this\\nbutton, you can quickly report any issues you find."\n    }), "\\n", _jsx(_components.p, {\n      children: "This feature is a result of a user suggestion, and we are always listening to\\nyour feedback."\n    }), "\\n", _jsx(_components.p, {\n      children: "Help us make Chair Flight better!"\n    }), "\\n", _jsxs(Stack, {\n      sx: {\n        justifyContent: "space-between",\n        my: 2\n      },\n      maxWidth: "sm",\n      margin: "auto",\n      direction: "row",\n      children: [_jsx(BugReportButton, {}), _jsx(BugReportButton, {}), _jsx(BugReportButton, {}), _jsx(BugReportButton, {}), _jsx(BugReportButton, {}), _jsx(BugReportButton, {}), _jsx(BugReportButton, {}), _jsx(BugReportButton, {}), _jsx(BugReportButton, {}), _jsx(BugReportButton, {})]\n    })]\n  });\n}\nfunction MDXContent(props = {}) {\n  const {wrapper: MDXLayout} = {\n    ..._provideComponents(),\n    ...props.components\n  };\n  return MDXLayout ? _jsx(MDXLayout, {\n    ...props,\n    children: _jsx(_createMdxContent, {\n      ...props\n    })\n  }) : _createMdxContent(props);\n}\nreturn {\n  default: MDXContent\n};\nfunction _missingMdxReference(id, component) {\n  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");\n}\n',
    },
    title: "Adding an Issue report shortcut",
    description:
      "In order to make it easier for you to report issues with Chair Flight, we  have added a new button in the top right corner to all our pages. With this  button, you can quickly report any issues you find.\n",
    tag: "Feature",
    date: "2024-01-27",
    tagHref: "/blog?tag=Feature",
  },
};
