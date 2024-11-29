import DatabaseService from './database';

const StorageService = {
  // User related storage
  getUser: async () => {
    try {
      const rememberedUser = await DatabaseService.getRememberedUser();
      if (rememberedUser) {
        const user = await DatabaseService.getUser(rememberedUser.credential);
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  setUser: async (user) => {
    try {
      if (!user) {
        // Only clear remembered user credentials when logging out
        await DatabaseService.setRememberedUser(null, null);
        return;
      }

      // For new users
      if (!user.id) {
        return await DatabaseService.createUser(user);
      }
    } catch (error) {
      console.error('Error setting user:', error);
      throw error;
    }
  },

  // Tasks related storage
  getTasks: async (userId) => {
    return await DatabaseService.getTasks(userId);
  },

  setTasks: async (userId, tasks) => {
    // Delete existing tasks and insert new ones
    for (const task of tasks) {
      if (task.id) {
        await DatabaseService.updateTask(task.id, task);
      } else {
        await DatabaseService.createTask(userId, task);
      }
    }
  },

  // Milestones related storage
  getMilestones: async (userId) => {
    return await DatabaseService.getMilestones(userId);
  },

  setMilestones: async (userId, milestones) => {
    for (const milestone of milestones) {
      if (milestone.id) {
        await DatabaseService.updateMilestone(milestone.id, milestone);
      } else {
        await DatabaseService.createMilestone(userId, milestone);
      }
    }
  },

  // Remember me functionality
  getRememberedUser: async () => {
    return await DatabaseService.getRememberedUser();
  },

  setRememberedUser: async (userId, credential) => {
    if (userId && credential) {
      await DatabaseService.setRememberedUser(userId, credential);
    }
  },

  // Theme preferences
  setUserTheme: async (userId, mode) => {
    await DatabaseService.setUserTheme(userId, mode);
  },

  getUserTheme: async (userId) => {
    return await DatabaseService.getUserTheme(userId);
  },

  // Update user login info
  updateUserLoginInfo: async (userId) => {
    await DatabaseService.updateUserLoginInfo(userId);
  },

  // Add this method to check if a user exists
  checkUserExists: async (username) => {
    const user = await DatabaseService.getUser(username);
    return !!user;
  },

  // Add this method to get users by email (for forgot password)
  getUserByEmail: async (email) => {
    return await DatabaseService.getUserByEmail(email);
  },

  // Add these new methods
  updateTask: async (taskId, task) => {
    return await DatabaseService.updateTask(taskId, task);
  },

  createTask: async (userId, task) => {
    return await DatabaseService.createTask(userId, task);
  },

  createMilestone: async (userId, milestone) => {
    return await DatabaseService.createMilestone(userId, milestone);
  },

  updateMilestone: async (milestoneId, milestone) => {
    return await DatabaseService.updateMilestone(milestoneId, milestone);
  },

  getTasksWithMilestones: async (userId) => {
    return await DatabaseService.getTasksWithMilestones(userId);
  },

  getTaskStatistics: async (userId) => {
    return await DatabaseService.getTaskStatistics(userId);
  },

  searchTasks: async (userId, searchTerm) => {
    return await DatabaseService.searchTasks(userId, searchTerm);
  },

  exportUserData: async (userId) => {
    return await DatabaseService.exportData(userId);
  },

  importUserData: async (data) => {
    return await DatabaseService.importData(data);
  },

  deleteUser: async (userId) => {
    return await DatabaseService.deleteUser(userId);
  },

  clearAllData: async () => {
    return await DatabaseService.clearDatabase();
  },

  // Add this method
  deleteTask: async (taskId) => {
    try {
      console.log('Storage service deleting task:', taskId);
      await DatabaseService.deleteTask(taskId);
      console.log('Storage service delete successful');
    } catch (error) {
      console.error('Storage service delete failed:', error);
      throw error;
    }
  },

  // Add this method
  deleteMilestone: async (milestoneId) => {
    try {
      console.log('Storage service deleting milestone:', milestoneId);
      await DatabaseService.deleteMilestone(milestoneId);
      console.log('Storage service milestone delete successful');
    } catch (error) {
      console.error('Storage service milestone delete failed:', error);
      throw error;
    }
  }
};

export default StorageService; 