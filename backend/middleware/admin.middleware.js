export const adminMiddleware = (req, res, next) => {
  // req.user diisi oleh authMiddleware sebelumnya
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ 
    message: "Akses ditolak. Tindakan ini hanya dapat dilakukan oleh Admin." 
  });
};