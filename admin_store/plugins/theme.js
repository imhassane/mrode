export default (_, inject) => {
  const theme = {
    buttons: {
      primary: "px-3 py-1 bg-green-500 border border-green-500 rounded text-white text-sm",
      secondary: "px-3 py-1 border border-green-500 rounded text-green-500 text-sm",
      danger: "px-3 py-1 border border-red-500 rounded text-red-500 text-sm",
      dangerFull: "px-3 py-1 bg-red-500 border border-red-500 rounded text-white text-sm",
      warningFull: "px-3 py-1 bg-yellow-500 border border-yellow-500 rounded text-white text-sm",
      warning: "px-3 py-1 border border-yellow-500 rounded text-yellow-500 text-sm",
    },
    titles: {
      h1: "font-bold text-3xl",
      h2: "font-bold text-xl",
    },
    inputs: {
      text: "border rounded px-3 py-1 text-sm flex items-center"
    },
    tags: {
      danger: "px-3 text-sm bg-red-500 text-white border border-red-500 rounded",
      success: "px-3 text-sm bg-green-500 text-white border border-green-500 rounded"
    },
    label: "block font-semibold text-sm mb-2",
    tag: "px-2 py-1 h-6 border-green-500 bg-green-500 text-white text-xs rounded cursor-pointer"
  };

  inject('theme', theme);
};
