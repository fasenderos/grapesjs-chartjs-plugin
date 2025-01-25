export default ({ config }) => {
  return {
    ...config,
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        ...config.module.rules,
      ],
    },
  };
};
