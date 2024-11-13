const StorageService = {
  // User related storage
  getUser: () => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  },

  setUser: (user) => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  },

  // Tasks related storage
  getTasks: (username) => {
    const savedTasks = localStorage.getItem(`tasks_${username}`);
    return savedTasks ? JSON.parse(savedTasks) : [];
  },

  setTasks: (username, tasks) => {
    localStorage.setItem(`tasks_${username}`, JSON.stringify(tasks));
  },

  // Milestones related storage
  getMilestones: (username) => {
    const savedMilestones = localStorage.getItem(`milestones_${username}`);
    return savedMilestones ? JSON.parse(savedMilestones) : [];
  },

  setMilestones: (username, milestones) => {
    localStorage.setItem(`milestones_${username}`, JSON.stringify(milestones));
  },

  // Auth related storage
  getRememberedUser: () => {
    const remembered = localStorage.getItem('rememberedUser');
    return remembered ? JSON.parse(remembered) : null;
  },

  setRememberedUser: (loginMethod, credential) => {
    if (loginMethod && credential) {
      localStorage.setItem('rememberedUser', JSON.stringify({ loginMethod, credential }));
    } else {
      localStorage.removeItem('rememberedUser');
    }
  },

  // Clear user data
  clearUserData: (username) => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentTab');
    localStorage.removeItem(`tasks_${username}`);
    localStorage.removeItem(`milestones_${username}`);
    localStorage.removeItem(`theme_${username}`);
  },

  // Users management
  getUsers: () => {
    return JSON.parse(localStorage.getItem('users')) || [];
  },

  setUsers: (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  },

  updateUserLoginInfo: (userId) => {
    const users = StorageService.getUsers();
    const updatedUsers = users.map(u => 
      u.id === userId 
        ? { 
            ...u, 
            lastLogin: new Date().toISOString(),
            loginCount: (u.loginCount || 0) + 1
          }
        : u
    );
    StorageService.setUsers(updatedUsers);
  },

  // Theme preferences
  setUserTheme: (username, mode) => {
    localStorage.setItem(`theme_${username}`, mode);
  },

  getUserTheme: (username) => {
    return localStorage.getItem(`theme_${username}`) || 'light';
  },
};

export default StorageService; 