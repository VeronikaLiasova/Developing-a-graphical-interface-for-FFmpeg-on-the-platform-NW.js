module.exports = (config) => {
    return {
        ...config,
        // By default Webpack builds for web target,
        // so internal node modules will not be available
        // without this transformation
        target: 'node-webkit',
    };
};