const ApplicationWindow = require("../services/ApplicationWindow");

exports.isWindowOpen = async (_, res, next) => {
  const isOpen = true;
  // TODO: Update this logic to read from DB
  // const isOpen = await ApplicationWindow.isOpen();

  if (!isOpen) {
    return res.status(403).json({
      success: false,
      error: "Access Denied! :(",
      message: "Application window is not open"
    });
  }

  return next();
};
