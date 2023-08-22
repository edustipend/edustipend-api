const ApplicationWindow = require("../services/ApplicationWindow");

exports.isWindowOpen = async (req, res, next) => {
  const isOpen = await ApplicationWindow.isOpen();

  if (!isOpen) {
    return res.status(403).json({
      success: false,
      message: "Access Denied! :("
    });
  }

  return next();
};
