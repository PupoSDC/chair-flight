if (process.env.NODE_ENV === "development") {
  module.exports.jsxRuntime = require("react/jsx-dev-runtime") || {};
  module.exports.jsxRuntime.jsxs = module.exports.jsxRuntime.jsxs || null;
  module.exports.jsxRuntime.jsxsDEV = module.exports.jsxRuntime.jsxsDEV || null;
  module.exports.jsxRuntime.jsx = module.exports.jsxRuntime.jsx || null;
  module.exports.jsxRuntime.jsxDev = module.exports.jsxRuntime.jsxDev || null;
} else {
  module.exports.jsxRuntime = require("react/jsx-runtime") || {};
  module.exports.jsxRuntime.jsxs = module.exports.jsxRuntime.jsxs || null;
  module.exports.jsxRuntime.jsxsDEV = module.exports.jsxRuntime.jsxsDEV || null;
  module.exports.jsxRuntime.jsx = module.exports.jsxRuntime.jsx || null;
  module.exports.jsxRuntime.jsxDev = module.exports.jsxRuntime.jsxDev || null;
}
