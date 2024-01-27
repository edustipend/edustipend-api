const ApplicationWindow = require("../services/ApplicationWindow");

exports.isWindowOpen = async (req, res, next) => {
  const isOpen = false;

  // TODO: Update this logic to read from DB
  // const isOpen = await ApplicationWindow.isOpen();

  if (!isOpen) {
    return res.status(403).json({
      success: false,
      error: "Application window is not open",
      message: "Access Denied! :("
    });
  }

  return next();
};
