/**
 * Admin Service
 * Handles all admin operations including:
 * - Memberstack API integration for user management
 * - Article and Pattern CRUD (including drafts)
 * - Audit logging
 * - Dashboard statistics
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Memberstack Admin API configuration
const MEMBERSTACK_API_URL = 'https://admin.memberstack.com/members';
const MEMBERSTACK_SECRET_KEY = process.env.MEMBERSTACK_SECRET_KEY;

// ============================================
// AUDIT LOGGING
// ============================================

/**
 * Log an admin action to the audit trail
 */
export async function logAdminAction({
  adminEmail,
  adminId,
  action,
  targetType,
  targetId,
  targetName,
  changes = null,
  ipAddress = null,
  userAgent = null
}) {
  try {
    const log = await prisma.adminAuditLog.create({
      data: {
        adminEmail,
        adminId: adminId || 'unknown',
        action,
        targetType,
        targetId,
        targetName,
        changes,
        ipAddress,
        userAgent
      }
    });
    return log;
  } catch (error) {
    console.error('Error logging admin action:', error);
    // Don't throw - logging should not break main operations
    return null;
  }
}

/**
 * Get audit logs with filtering and pagination
 */
export async function getAuditLogs({
  adminEmail = null,
  action = null,
  targetType = null,
  startDate = null,
  endDate = null,
  page = 1,
  limit = 50
} = {}) {
  try {
    const skip = (page - 1) * limit;
    
    const where = {
      ...(adminEmail && { adminEmail }),
      ...(action && { action }),
      ...(targetType && { targetType }),
      ...(startDate || endDate ? {
        createdAt: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) })
        }
      } : {})
    };

    const [logs, total] = await Promise.all([
      prisma.adminAuditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.adminAuditLog.count({ where })
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    };
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw new Error('Failed to fetch audit logs');
  }
}

// ============================================
// MEMBERSTACK USER MANAGEMENT
// ============================================

/**
 * Fetch all members from Memberstack
 */
export async function listMembers({
  page = 1,
  limit = 20,
  search = null
} = {}) {
  try {
    if (!MEMBERSTACK_SECRET_KEY || MEMBERSTACK_SECRET_KEY === 'your_memberstack_secret_key_here') {
      // Return mock data if no secret key configured
      return {
        members: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        warning: 'Memberstack secret key not configured'
      };
    }

    const offset = (page - 1) * limit;
    
    const response = await fetch(
      `${MEMBERSTACK_API_URL}?limit=${limit}&offset=${offset}${search ? `&search=${encodeURIComponent(search)}` : ''}`,
      {
        headers: {
          'X-API-KEY': MEMBERSTACK_SECRET_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Memberstack API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      members: data.data || [],
      pagination: {
        page,
        limit,
        total: data.totalCount || 0,
        totalPages: Math.ceil((data.totalCount || 0) / limit)
      }
    };
  } catch (error) {
    console.error('Error listing members:', error);
    throw new Error('Failed to fetch members from Memberstack');
  }
}

/**
 * Get a single member by ID
 */
export async function getMember(memberId) {
  try {
    if (!MEMBERSTACK_SECRET_KEY || MEMBERSTACK_SECRET_KEY === 'your_memberstack_secret_key_here') {
      throw new Error('Memberstack secret key not configured');
    }

    const response = await fetch(
      `${MEMBERSTACK_API_URL}/${memberId}`,
      {
        headers: {
          'X-API-KEY': MEMBERSTACK_SECRET_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Memberstack API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching member:', error);
    throw error;
  }
}

/**
 * Update a member's data
 */
export async function updateMember(memberId, updates, adminInfo) {
  try {
    if (!MEMBERSTACK_SECRET_KEY || MEMBERSTACK_SECRET_KEY === 'your_memberstack_secret_key_here') {
      throw new Error('Memberstack secret key not configured');
    }

    // Get current data for audit log
    const currentMember = await getMember(memberId);
    if (!currentMember) {
      throw new Error('Member not found');
    }

    const response = await fetch(
      `${MEMBERSTACK_API_URL}/${memberId}`,
      {
        method: 'PATCH',
        headers: {
          'X-API-KEY': MEMBERSTACK_SECRET_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Memberstack API error: ${response.status}`);
    }

    const updatedMember = await response.json();

    // Log the action
    await logAdminAction({
      adminEmail: adminInfo.email,
      adminId: adminInfo.id,
      action: 'UPDATE',
      targetType: 'USER',
      targetId: memberId,
      targetName: currentMember.auth?.email || memberId,
      changes: {
        before: currentMember,
        after: updatedMember.data || updatedMember
      },
      ipAddress: adminInfo.ipAddress,
      userAgent: adminInfo.userAgent
    });

    return updatedMember.data || updatedMember;
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
}

/**
 * Delete a member
 */
export async function deleteMember(memberId, adminInfo) {
  try {
    if (!MEMBERSTACK_SECRET_KEY || MEMBERSTACK_SECRET_KEY === 'your_memberstack_secret_key_here') {
      throw new Error('Memberstack secret key not configured');
    }

    // Get current data for audit log
    const currentMember = await getMember(memberId);
    if (!currentMember) {
      throw new Error('Member not found');
    }

    const response = await fetch(
      `${MEMBERSTACK_API_URL}/${memberId}`,
      {
        method: 'DELETE',
        headers: {
          'X-API-KEY': MEMBERSTACK_SECRET_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Memberstack API error: ${response.status}`);
    }

    // Log the action
    await logAdminAction({
      adminEmail: adminInfo.email,
      adminId: adminInfo.id,
      action: 'DELETE',
      targetType: 'USER',
      targetId: memberId,
      targetName: currentMember.auth?.email || memberId,
      changes: { deleted: currentMember },
      ipAddress: adminInfo.ipAddress,
      userAgent: adminInfo.userAgent
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
}

// ============================================
// ARTICLE MANAGEMENT (Including Drafts)
// ============================================

/**
 * Get all articles (including unpublished for admin)
 */
export async function getAllArticles({
  published = null,
  category = null,
  page = 1,
  limit = 20,
  search = null
} = {}) {
  try {
    const skip = (page - 1) * limit;
    
    const where = {
      ...(published !== null && { published }),
      ...(category && { category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [articles, total] = await Promise.all([
      prisma.learningArticle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.learningArticle.count({ where })
    ]);

    // Map backend fields to frontend format
    const mappedArticles = articles.map(article => ({
      ...article,
      description: article.excerpt,
      imageUrl: article.thumbnailUrl,
      status: article.published ? 'published' : 'draft'
    }));

    return {
      articles: mappedArticles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw new Error('Failed to fetch articles');
  }
}

/**
 * Get a single article by ID (for editing)
 */
export async function getArticleById(id) {
  try {
    const article = await prisma.learningArticle.findUnique({
      where: { id }
    });
    
    if (!article) return null;
    
    // Map backend fields to frontend format
    return {
      ...article,
      description: article.excerpt,
      imageUrl: article.thumbnailUrl,
      status: article.published ? 'published' : 'draft'
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    throw new Error('Failed to fetch article');
  }
}

/**
 * Create a new article
 */
export async function createArticle(data, adminInfo) {
  try {
    // Generate slug from title if not provided
    const slug = data.slug || data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Map frontend fields to backend schema
    const published = data.status === 'published' || data.published === true;
    const excerpt = data.description || data.excerpt || '';
    const thumbnailUrl = data.imageUrl || data.thumbnailUrl || null;
    const readTime = data.readTime ? parseInt(data.readTime) : 5;

    const article = await prisma.learningArticle.create({
      data: {
        title: data.title,
        slug,
        excerpt,
        content: data.content || '',
        youtubeUrl: data.youtubeUrl || null,
        thumbnailUrl,
        category: data.category || 'beginner',
        tags: data.tags || [],
        readTime,
        authorName: data.authorName || adminInfo.email,
        authorAvatar: data.authorAvatar || null,
        difficulty: data.difficulty || 'beginner',
        published,
        featured: data.featured || false,
        publishedAt: published ? new Date() : null
      }
    });

    // Log the action
    await logAdminAction({
      adminEmail: adminInfo.email,
      adminId: adminInfo.id,
      action: 'CREATE',
      targetType: 'ARTICLE',
      targetId: article.id,
      targetName: article.title,
      changes: { created: article },
      ipAddress: adminInfo.ipAddress,
      userAgent: adminInfo.userAgent
    });

    return article;
  } catch (error) {
    console.error('Error creating article:', error);
    if (error.code === 'P2002') {
      throw new Error('An article with this slug already exists');
    }
    throw new Error('Failed to create article');
  }
}

/**
 * Update an article
 */
export async function updateArticle(id, data, adminInfo) {
  try {
    // Get current data for audit log
    const currentArticle = await prisma.learningArticle.findUnique({
      where: { id }
    });

    if (!currentArticle) {
      throw new Error('Article not found');
    }

    // Map frontend fields to backend schema
    const updateData = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined || data.excerpt !== undefined) {
      updateData.excerpt = data.description || data.excerpt;
    }
    if (data.content !== undefined) updateData.content = data.content;
    if (data.imageUrl !== undefined || data.thumbnailUrl !== undefined) {
      updateData.thumbnailUrl = data.imageUrl || data.thumbnailUrl;
    }
    if (data.category !== undefined) updateData.category = data.category;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.readTime !== undefined) {
      updateData.readTime = typeof data.readTime === 'string' ? parseInt(data.readTime) : data.readTime;
    }
    if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
    if (data.featured !== undefined) updateData.featured = data.featured;
    
    // Handle status/published field
    if (data.status !== undefined) {
      updateData.published = data.status === 'published';
      if (updateData.published && !currentArticle.published) {
        updateData.publishedAt = new Date();
      }
    } else if (data.published !== undefined) {
      updateData.published = data.published;
      if (updateData.published && !currentArticle.published) {
        updateData.publishedAt = new Date();
      }
    }

    const article = await prisma.learningArticle.update({
      where: { id },
      data: updateData
    });

    // Log the action
    await logAdminAction({
      adminEmail: adminInfo.email,
      adminId: adminInfo.id,
      action: 'UPDATE',
      targetType: 'ARTICLE',
      targetId: article.id,
      targetName: article.title,
      changes: data.changeMessage 
        ? { message: data.changeMessage }
        : {
            before: currentArticle,
            after: article
          },
      ipAddress: adminInfo.ipAddress,
      userAgent: adminInfo.userAgent
    });

    return article;
  } catch (error) {
    console.error('Error updating article:', error);
    if (error.code === 'P2002') {
      throw new Error('An article with this slug already exists');
    }
    throw error;
  }
}

/**
 * Delete an article
 */
export async function deleteArticle(id, adminInfo) {
  try {
    // Get current data for audit log
    const currentArticle = await prisma.learningArticle.findUnique({
      where: { id }
    });

    if (!currentArticle) {
      throw new Error('Article not found');
    }

    await prisma.learningArticle.delete({
      where: { id }
    });

    // Log the action
    await logAdminAction({
      adminEmail: adminInfo.email,
      adminId: adminInfo.id,
      action: 'DELETE',
      targetType: 'ARTICLE',
      targetId: id,
      targetName: currentArticle.title,
      changes: { deleted: currentArticle },
      ipAddress: adminInfo.ipAddress,
      userAgent: adminInfo.userAgent
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
}

// ============================================
// PATTERN MANAGEMENT
// ============================================

/**
 * Get all patterns (for admin)
 */
export async function getAllPatterns({
  patternType = null,
  page = 1,
  limit = 20,
  search = null
} = {}) {
  try {
    const skip = (page - 1) * limit;
    
    const where = {
      ...(patternType && { patternType }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [patterns, total] = await Promise.all([
      prisma.chartPattern.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.chartPattern.count({ where })
    ]);

    // Map backend fields to frontend format
    const mappedPatterns = patterns.map(pattern => ({
      ...pattern,
      title: pattern.name,
      summary: pattern.excerpt,
      status: pattern.published ? 'published' : 'draft'
    }));

    return {
      patterns: mappedPatterns,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching patterns:', error);
    throw new Error('Failed to fetch patterns');
  }
}

/**
 * Get a single pattern by ID (for editing)
 */
export async function getPatternById(id) {
  try {
    const pattern = await prisma.chartPattern.findUnique({
      where: { id }
    });
    
    if (!pattern) return null;
    
    // Map backend fields to frontend format
    return {
      ...pattern,
      title: pattern.name,
      summary: pattern.excerpt,
      status: pattern.published ? 'published' : 'draft'
    };
  } catch (error) {
    console.error('Error fetching pattern:', error);
    throw new Error('Failed to fetch pattern');
  }
}

/**
 * Create a new pattern
 */
export async function createPattern(data, adminInfo) {
  try {
    // Map frontend fields to backend schema
    const name = data.title || data.name;
    const excerpt = data.summary || data.excerpt || '';
    const published = data.status === 'published' || data.published === true;
    const category = data.category || data.patternType || 'bullish';
    
    // Generate slug from name if not provided
    const slug = data.slug || name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const pattern = await prisma.chartPattern.create({
      data: {
        name,
        slug,
        imageUrl: data.imageUrl || null,
        description: data.description || '',
        excerpt,
        patternType: category,
        difficulty: data.difficulty || 'beginner',
        keyPoints: data.keyPoints || [],
        howToTrade: data.howToTrade || '',
        examples: data.examples || [],
        reliability: data.reliability || 'medium',
        published
      }
    });

    // Log the action
    await logAdminAction({
      adminEmail: adminInfo.email,
      adminId: adminInfo.id,
      action: 'CREATE',
      targetType: 'PATTERN',
      targetId: pattern.id,
      targetName: pattern.name,
      changes: { created: pattern },
      ipAddress: adminInfo.ipAddress,
      userAgent: adminInfo.userAgent
    });

    return pattern;
  } catch (error) {
    console.error('Error creating pattern:', error);
    if (error.code === 'P2002') {
      throw new Error('A pattern with this slug already exists');
    }
    throw new Error('Failed to create pattern');
  }
}

/**
 * Update a pattern
 */
export async function updatePattern(id, data, adminInfo) {
  try {
    // Get current data for audit log
    const currentPattern = await prisma.chartPattern.findUnique({
      where: { id }
    });

    if (!currentPattern) {
      throw new Error('Pattern not found');
    }

    // Map frontend fields to backend schema
    const updateData = {};
    
    if (data.title !== undefined || data.name !== undefined) {
      updateData.name = data.title || data.name;
    }
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.summary !== undefined || data.excerpt !== undefined) {
      updateData.excerpt = data.summary || data.excerpt;
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.category !== undefined || data.patternType !== undefined) {
      updateData.patternType = data.category || data.patternType;
    }
    if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
    if (data.keyPoints !== undefined) updateData.keyPoints = data.keyPoints;
    if (data.howToTrade !== undefined) updateData.howToTrade = data.howToTrade;
    if (data.examples !== undefined) updateData.examples = data.examples;
    if (data.reliability !== undefined) updateData.reliability = data.reliability;
    
    // Handle status/published field
    if (data.status !== undefined) {
      updateData.published = data.status === 'published';
    } else if (data.published !== undefined) {
      updateData.published = data.published;
    }

    const pattern = await prisma.chartPattern.update({
      where: { id },
      data: updateData
    });

    // Log the action
    await logAdminAction({
      adminEmail: adminInfo.email,
      adminId: adminInfo.id,
      action: 'UPDATE',
      targetType: 'PATTERN',
      targetId: pattern.id,
      targetName: pattern.name,
      changes: data.changeMessage 
        ? { message: data.changeMessage }
        : {
            before: currentPattern,
            after: pattern
          },
      ipAddress: adminInfo.ipAddress,
      userAgent: adminInfo.userAgent
    });

    return pattern;
  } catch (error) {
    console.error('Error updating pattern:', error);
    if (error.code === 'P2002') {
      throw new Error('A pattern with this slug already exists');
    }
    throw error;
  }
}

/**
 * Delete a pattern
 */
export async function deletePattern(id, adminInfo) {
  try {
    // Get current data for audit log
    const currentPattern = await prisma.chartPattern.findUnique({
      where: { id }
    });

    if (!currentPattern) {
      throw new Error('Pattern not found');
    }

    await prisma.chartPattern.delete({
      where: { id }
    });

    // Log the action
    await logAdminAction({
      adminEmail: adminInfo.email,
      adminId: adminInfo.id,
      action: 'DELETE',
      targetType: 'PATTERN',
      targetId: id,
      targetName: currentPattern.name,
      changes: { deleted: currentPattern },
      ipAddress: adminInfo.ipAddress,
      userAgent: adminInfo.userAgent
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting pattern:', error);
    throw error;
  }
}

// ============================================
// DASHBOARD STATISTICS
// ============================================

/**
 * Get dashboard statistics
 */
export async function getDashboardStats() {
  try {
    // Get users count from Memberstack
    let totalUsers = 0;
    try {
      if (MEMBERSTACK_SECRET_KEY && MEMBERSTACK_SECRET_KEY !== 'your_memberstack_secret_key_here') {
        const membersResult = await listMembers({ page: 1, limit: 1 });
        totalUsers = membersResult.pagination?.total || 0;
      }
    } catch (err) {
      console.warn('Could not fetch users count:', err.message);
    }

    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      featuredArticles,
      totalPatterns,
      recentLogs,
      articlesByCategory,
      patternsByType
    ] = await Promise.all([
      prisma.learningArticle.count(),
      prisma.learningArticle.count({ where: { published: true } }),
      prisma.learningArticle.count({ where: { published: false } }),
      prisma.learningArticle.count({ where: { featured: true } }),
      prisma.chartPattern.count(),
      prisma.adminAuditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.learningArticle.groupBy({
        by: ['category'],
        _count: { category: true }
      }),
      prisma.chartPattern.groupBy({
        by: ['patternType'],
        _count: { patternType: true }
      })
    ]);

    // Get popular content by views
    const [popularArticles, popularPatterns] = await Promise.all([
      prisma.learningArticle.findMany({
        take: 5,
        orderBy: { viewCount: 'desc' },
        where: { published: true },
        select: { id: true, title: true, slug: true, viewCount: true }
      }),
      prisma.chartPattern.findMany({
        take: 5,
        orderBy: { viewCount: 'desc' },
        select: { id: true, name: true, slug: true, viewCount: true }
      })
    ]);

    // Get recent content (articles and patterns combined)
    const [recentArticles, recentPatterns] = await Promise.all([
      prisma.learningArticle.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, slug: true, published: true, createdAt: true, updatedAt: true }
      }),
      prisma.chartPattern.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, slug: true, published: true, createdAt: true, updatedAt: true }
      })
    ]);

    // Combine and sort recent content by date
    const recentContent = [
      ...recentArticles.map(a => ({ ...a, type: 'article' })),
      ...recentPatterns.map(p => ({ ...p, title: p.name, type: 'pattern' }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);

    // Combine popular content with type info
    const popularContentCombined = [
      ...popularArticles.map(a => ({ ...a, type: 'article' })),
      ...popularPatterns.map(p => ({ ...p, title: p.name, type: 'pattern' }))
    ].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 10);

    return {
      articles: {
        total: totalArticles,
        published: publishedArticles,
        drafts: draftArticles,
        featured: featuredArticles,
        byCategory: articlesByCategory.reduce((acc, item) => {
          acc[item.category] = item._count.category;
          return acc;
        }, {})
      },
      patterns: {
        total: totalPatterns,
        byType: patternsByType.reduce((acc, item) => {
          acc[item.patternType] = item._count.patternType;
          return acc;
        }, {})
      },
      users: {
        total: totalUsers
      },
      recentActivity: recentLogs,
      recentContent: recentContent,
      popularContent: popularContentCombined
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
}

export default {
  // Audit logging
  logAdminAction,
  getAuditLogs,
  // User management
  listMembers,
  getMember,
  updateMember,
  deleteMember,
  // Article management
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  // Pattern management
  getAllPatterns,
  getPatternById,
  createPattern,
  updatePattern,
  deletePattern,
  // Dashboard
  getDashboardStats
};
