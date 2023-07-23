const retry = async (func, consoleMessage, interval) => {
  try {
    await func();
  } catch (error) {
    console.log(consoleMessage);
    await new Promise((resolve) => setTimeout(resolve, interval));
    await retry(func, consoleMessage, interval);
  }
};

module.exports = retry;
