// Pin a non-UTC time zone for the whole suite. Parsing bugs that resolve a string
// in the system zone instead of the requested one are invisible under UTC,
// which is what CI runners default to.
module.exports = () => {
    process.env.TZ = 'Europe/Moscow';
};
