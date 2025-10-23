const { UserRole } = require('@prisma/client');

// Role hierarchy: ADMIN > CONTRIBUTOR > BEGINNER
const ROLE_HIERARCHY = {
  [UserRole.ADMIN]: 3,
  [UserRole.CONTRIBUTOR]: 2,
  [UserRole.BEGINNER]: 1,
};

// Check if user has required role or higher
const hasRole = (userRole, requiredRole) => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  if (!hasRole(req.user.role, UserRole.ADMIN)) {
    return res.status(403).json({ 
      success: false, 
      error: 'Admin access required' 
    });
  }

  next();
};

// Middleware to check if user is contributor or admin
const requireContributor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  if (!hasRole(req.user.role, UserRole.CONTRIBUTOR)) {
    return res.status(403).json({ 
      success: false, 
      error: 'Contributor access or higher required' 
    });
  }

  next();
};

// Middleware to check if user can moderate content
const canModerate = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  // Admins can moderate everything
  if (hasRole(req.user.role, UserRole.ADMIN)) {
    return next();
  }

  // Contributors can moderate their own content
  if (hasRole(req.user.role, UserRole.CONTRIBUTOR)) {
    return next();
  }

  return res.status(403).json({ 
    success: false, 
    error: 'Insufficient permissions to moderate content' 
  });
};

// Middleware to check if user can access user management
const canManageUsers = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  if (!hasRole(req.user.role, UserRole.ADMIN)) {
    return res.status(403).json({ 
      success: false, 
      error: 'Admin access required for user management' 
    });
  }

  next();
};

// Helper function to check if user can edit/delete content
const canEditContent = (user, contentAuthorId) => {
  // Users can always edit their own content
  if (user.id === contentAuthorId) {
    return true;
  }

  // Admins can edit any content
  if (hasRole(user.role, UserRole.ADMIN)) {
    return true;
  }

  // Contributors can edit content from beginners
  if (hasRole(user.role, UserRole.CONTRIBUTOR)) {
    // This would require checking the content author's role
    // For now, we'll implement this in the specific endpoints
    return false;
  }

  return false;
};

module.exports = {
  hasRole,
  requireAdmin,
  requireContributor,
  canModerate,
  canManageUsers,
  canEditContent,
  UserRole,
};
