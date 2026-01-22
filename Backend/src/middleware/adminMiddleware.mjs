/**
 * Admin Middleware
 * Verifies that the requesting user is an authorized admin
 */

// Get admin emails from environment variable
const getAdminEmails = () => {
  const adminEmailsStr = process.env.ADMIN_EMAILS || '';
  return adminEmailsStr.split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
};

/**
 * Check if an email is in the admin list
 */
export const isAdminEmail = (email) => {
  if (!email) return false;
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
};

/**
 * Middleware to verify admin access
 * Expects admin email to be passed in headers or body
 */
export const requireAdmin = (req, res, next) => {
  // Get admin email from various sources
  const adminEmail = req.headers['x-admin-email'] || 
                     req.body?.adminEmail || 
                     req.query?.adminEmail;

  if (!adminEmail) {
    return res.status(401).json({
      success: false,
      error: 'Admin authentication required',
      code: 'ADMIN_AUTH_REQUIRED'
    });
  }

  if (!isAdminEmail(adminEmail)) {
    return res.status(403).json({
      success: false,
      error: 'Access denied. You do not have admin privileges.',
      code: 'ADMIN_ACCESS_DENIED'
    });
  }

  // Attach admin info to request for use in routes
  req.admin = {
    email: adminEmail.toLowerCase()
  };

  next();
};

/**
 * Optional admin check - doesn't block, just adds admin info if valid
 */
export const optionalAdmin = (req, res, next) => {
  const adminEmail = req.headers['x-admin-email'] || 
                     req.body?.adminEmail || 
                     req.query?.adminEmail;

  if (adminEmail && isAdminEmail(adminEmail)) {
    req.admin = {
      email: adminEmail.toLowerCase()
    };
  }

  next();
};

export default { requireAdmin, optionalAdmin, isAdminEmail };
