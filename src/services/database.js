
let db = null;

const DatabaseService = {
  // Initialize database connection
  init: () => {
    return new Promise((resolve, reject) => {
      if (db) return resolve(db);

      const request = indexedDB.open('MomentumDB', 1);

      request.onerror = () => {
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = (event) => {
        db = event.target.result;
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create users store
        if (!db.objectStoreNames.contains('users')) {
          const usersStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
          usersStore.createIndex('username', 'username', { unique: true });
          usersStore.createIndex('email', 'email', { unique: true });
        }

        // Create tasks store
        if (!db.objectStoreNames.contains('tasks')) {
          const tasksStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
          tasksStore.createIndex('userId', 'userId', { unique: false });
        }

        // Create milestones store
        if (!db.objectStoreNames.contains('milestones')) {
          const milestonesStore = db.createObjectStore('milestones', { keyPath: 'id', autoIncrement: true });
          milestonesStore.createIndex('userId', 'userId', { unique: false });
          milestonesStore.createIndex('taskId', 'taskId', { unique: false });
        }

        // Create remembered users store
        if (!db.objectStoreNames.contains('remembered_users')) {
          db.createObjectStore('remembered_users', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  },

  // User related queries
  getUser: async (username) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const index = store.index('username');
      const request = index.get(username);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  createUser: async (user) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      const request = store.add({
        ...user,
        loginCount: 0,
        theme: 'light'
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Tasks related queries
  getTasks: async (userId) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(['tasks', 'milestones'], 'readonly');
        const taskStore = transaction.objectStore('tasks');
        const milestoneStore = transaction.objectStore('milestones');
        const taskIndex = taskStore.index('userId');
        const tasks = [];

        const taskRequest = taskIndex.getAll(userId);

        taskRequest.onsuccess = () => {
          const tasksData = taskRequest.result;
          let completedTasks = 0;
          const totalTasks = tasksData.length;

          if (totalTasks === 0) {
            resolve([]);
            return;
          }

          tasksData.forEach(task => {
            const milestoneIndex = milestoneStore.index('taskId');
            const milestoneRequest = milestoneIndex.getAll(task.id);

            milestoneRequest.onsuccess = () => {
              task.milestones = milestoneRequest.result;
              tasks.push(task);
              completedTasks++;

              if (completedTasks === totalTasks) {
                console.log('Retrieved tasks with milestones:', tasks);
                resolve(tasks);
              }
            };

            milestoneRequest.onerror = (event) => {
              console.error('Error getting milestones:', event.target.error);
              completedTasks++;
              tasks.push(task);

              if (completedTasks === totalTasks) {
                resolve(tasks);
              }
            };
          });
        };

        taskRequest.onerror = (event) => {
          console.error('Error getting tasks:', event.target.error);
          reject(new Error('Failed to get tasks'));
        };
      } catch (error) {
        console.error('Caught error:', error);
        reject(error);
      }
    });
  },

  createTask: async (userId, task) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['tasks'], 'readwrite');
      const store = transaction.objectStore('tasks');
      const request = store.add({ ...task, userId });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  updateTask: async (taskId, task) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(['tasks'], 'readwrite');
        const store = transaction.objectStore('tasks');

        // Keep the existing task data and only update the provided fields
        const getRequest = store.get(Number(taskId));

        getRequest.onsuccess = () => {
          const existingTask = getRequest.result;
          if (existingTask) {
            // Merge existing task with updates, preserving existing data
            const updatedTask = {
              ...existingTask,
              ...task,
              id: Number(taskId), // Ensure ID remains unchanged
            };

            const putRequest = store.put(updatedTask);
            
            putRequest.onsuccess = () => {
              console.log('Task updated successfully:', updatedTask);
              resolve(updatedTask);
            };

            putRequest.onerror = (event) => {
              console.error('Error updating task:', event.target.error);
              reject(new Error('Failed to update task'));
            };
          } else {
            reject(new Error('Task not found'));
          }
        };

        getRequest.onerror = (event) => {
          console.error('Error getting task:', event.target.error);
          reject(new Error('Failed to get task'));
        };

        transaction.oncomplete = () => {
          console.log('Transaction completed');
        };

        transaction.onerror = (event) => {
          console.error('Transaction error:', event.target.error);
          reject(new Error('Transaction failed'));
        };
      } catch (error) {
        console.error('Caught error:', error);
        reject(error);
      }
    });
  },

  deleteTask: async (taskId) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(['tasks', 'milestones'], 'readwrite');
        const taskStore = transaction.objectStore('tasks');
        const milestoneStore = transaction.objectStore('milestones');

        // Delete the task
        const taskRequest = taskStore.delete(Number(taskId));

        // Delete associated milestones
        const milestoneIndex = milestoneStore.index('taskId');
        const milestoneRequest = milestoneIndex.openCursor(Number(taskId));

        milestoneRequest.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            milestoneStore.delete(cursor.primaryKey);
            cursor.continue();
          }
        };

        taskRequest.onsuccess = () => {
          console.log('Task and associated milestones deleted successfully');
          resolve();
        };

        transaction.oncomplete = () => {
          console.log('Transaction completed');
          resolve();
        };

        transaction.onerror = (event) => {
          console.error('Transaction error:', event.target.error);
          reject(new Error('Transaction failed'));
        };
      } catch (error) {
        console.error('Caught error:', error);
        reject(error);
      }
    });
  },


  setUserTheme: async (userId, theme) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      const request = store.get(userId);

      request.onsuccess = () => {
        const user = request.result;
        if (user) {
          user.theme = theme;
          store.put(user);
          resolve();
        } else {
          reject(new Error('User not found'));
        }
      };
      request.onerror = () => reject(request.error);
    });
  },

  getUserTheme: async (userId) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const request = store.get(userId);

      request.onsuccess = () => resolve(request.result?.theme || 'light');
      request.onerror = () => reject(request.error);
    });
  },

  // Milestones related queries
  getMilestones: async (userId) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['milestones'], 'readonly');
      const store = transaction.objectStore('milestones');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  createMilestone: async (userId, milestone) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['milestones'], 'readwrite');
      const store = transaction.objectStore('milestones');
      const request = store.add({ ...milestone, userId });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  updateMilestone: async (milestoneId, milestone) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['milestones'], 'readwrite');
      const store = transaction.objectStore('milestones');
      const request = store.put({ ...milestone, id: milestoneId });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  deleteMilestone: async (milestoneId) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['milestones'], 'readwrite');
      const store = transaction.objectStore('milestones');
      const request = store.delete(milestoneId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  // Remember me functionality
  setRememberedUser: async (userId, credential) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['remembered_users'], 'readwrite');
      const store = transaction.objectStore('remembered_users');
      
      // Clear existing entries first
      store.clear().onsuccess = () => {
        if (userId && credential) {
          // Then add new entry if credentials provided
          const request = store.add({ userId, credential });
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        } else {
          resolve();
        }
      };
    });
  },

  getRememberedUser: async () => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['remembered_users'], 'readonly');
      const store = transaction.objectStore('remembered_users');
      const request = store.getAll();

      request.onsuccess = () => {
        const users = request.result;
        resolve(users.length > 0 ? users[0] : null);
      };
      request.onerror = () => reject(request.error);
    });
  },

  // User login info
  updateUserLoginInfo: async (userId) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      const request = store.get(userId);

      request.onsuccess = () => {
        const user = request.result;
        if (user) {
          user.lastLogin = new Date().toISOString();
          user.loginCount = (user.loginCount || 0) + 1;
          store.put(user).onsuccess = () => resolve();
        } else {
          reject(new Error('User not found'));
        }
      };
      request.onerror = () => reject(request.error);
    });
  },

  // User management
  getAllUsers: async () => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  getUserByEmail: async (email) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const index = store.index('email');
      const request = index.get(email);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  deleteUser: async (userId) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['users', 'tasks', 'milestones', 'remembered_users'], 'readwrite');
      
      // Delete user
      const userStore = transaction.objectStore('users');
      userStore.delete(userId);

      // Delete user's tasks
      const taskStore = transaction.objectStore('tasks');
      const taskIndex = taskStore.index('userId');
      taskIndex.openCursor(userId).onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          taskStore.delete(cursor.primaryKey);
          cursor.continue();
        }
      };

      // Delete user's milestones
      const milestoneStore = transaction.objectStore('milestones');
      const milestoneIndex = milestoneStore.index('userId');
      milestoneIndex.openCursor(userId).onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          milestoneStore.delete(cursor.primaryKey);
          cursor.continue();
        }
      };

      // Delete remembered user entry
      const rememberedStore = transaction.objectStore('remembered_users');
      rememberedStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.userId === userId) {
            rememberedStore.delete(cursor.primaryKey);
          }
          cursor.continue();
        }
      };

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  },

  // Bulk operations
  bulkCreateTasks: async (userId, tasks) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['tasks'], 'readwrite');
      const store = transaction.objectStore('tasks');
      const results = [];

      tasks.forEach(task => {
        const request = store.add({ ...task, userId });
        request.onsuccess = () => results.push(request.result);
      });

      transaction.oncomplete = () => resolve(results);
      transaction.onerror = () => reject(transaction.error);
    });
  },

  bulkCreateMilestones: async (userId, milestones) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['milestones'], 'readwrite');
      const store = transaction.objectStore('milestones');
      const results = [];

      milestones.forEach(milestone => {
        const request = store.add({ ...milestone, userId });
        request.onsuccess = () => results.push(request.result);
      });

      transaction.oncomplete = () => resolve(results);
      transaction.onerror = () => reject(transaction.error);
    });
  },

  // Clear all data (useful for testing or reset functionality)
  clearDatabase: async () => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        ['users', 'tasks', 'milestones', 'remembered_users'],
        'readwrite'
      );

      ['users', 'tasks', 'milestones', 'remembered_users'].forEach(storeName => {
        transaction.objectStore(storeName).clear();
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  },

  // Additional methods for milestone management
  getMilestonesByTask: async (taskId) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['milestones'], 'readonly');
      const store = transaction.objectStore('milestones');
      const index = store.index('taskId');
      const request = index.getAll(taskId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  toggleMilestoneStatus: async (milestoneId) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['milestones'], 'readwrite');
      const store = transaction.objectStore('milestones');
      const request = store.get(milestoneId);

      request.onsuccess = () => {
        const milestone = request.result;
        if (milestone) {
          milestone.completed = !milestone.completed;
          store.put(milestone).onsuccess = () => resolve(milestone);
        } else {
          reject(new Error('Milestone not found'));
        }
      };
      request.onerror = () => reject(request.error);
    });
  },

  // Task management extensions
  getTasksByStatus: async (userId, completed) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['tasks'], 'readonly');
      const store = transaction.objectStore('tasks');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        const tasks = request.result.filter(task => task.completed === completed);
        resolve(tasks);
      };
      request.onerror = () => reject(request.error);
    });
  },

  getTasksWithMilestones: async (userId) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['tasks', 'milestones'], 'readonly');
      const taskStore = transaction.objectStore('tasks');
      const milestoneStore = transaction.objectStore('milestones');
      const taskIndex = taskStore.index('userId');
      
      const taskRequest = taskIndex.getAll(userId);
      
      taskRequest.onsuccess = () => {
        const tasks = taskRequest.result;
        let completedTasks = 0;
        let totalTasks = tasks.length;

        tasks.forEach(task => {
          const milestoneIndex = milestoneStore.index('taskId');
          const milestoneRequest = milestoneIndex.getAll(task.id);
          
          milestoneRequest.onsuccess = () => {
            task.milestones = milestoneRequest.result;
            completedTasks++;
            
            if (completedTasks === totalTasks) {
              resolve(tasks);
            }
          };
          
          milestoneRequest.onerror = () => reject(milestoneRequest.error);
        });

        if (tasks.length === 0) {
          resolve([]);
        }
      };
      
      taskRequest.onerror = () => reject(taskRequest.error);
    });
  },

  // User preferences and settings
  updateUserPreferences: async (userId, preferences) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      const request = store.get(userId);

      request.onsuccess = () => {
        const user = request.result;
        if (user) {
          const updatedUser = { ...user, ...preferences };
          store.put(updatedUser).onsuccess = () => resolve(updatedUser);
        } else {
          reject(new Error('User not found'));
        }
      };
      request.onerror = () => reject(request.error);
    });
  },

  // Statistics and analytics
  getTaskStatistics: async (userId) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['tasks', 'milestones'], 'readonly');
      const taskStore = transaction.objectStore('tasks');
      const milestoneStore = transaction.objectStore('milestones');
      const taskIndex = taskStore.index('userId');
      const milestoneIndex = milestoneStore.index('userId');

      const stats = {
        totalTasks: 0,
        completedTasks: 0,
        totalMilestones: 0,
        completedMilestones: 0,
        completionRate: 0
      };

      const taskRequest = taskIndex.getAll(userId);
      
      taskRequest.onsuccess = () => {
        const tasks = taskRequest.result;
        stats.totalTasks = tasks.length;
        stats.completedTasks = tasks.filter(task => task.completed).length;
        
        const milestoneRequest = milestoneIndex.getAll(userId);
        
        milestoneRequest.onsuccess = () => {
          const milestones = milestoneRequest.result;
          stats.totalMilestones = milestones.length;
          stats.completedMilestones = milestones.filter(m => m.completed).length;
          stats.completionRate = stats.totalTasks > 0 
            ? (stats.completedTasks / stats.totalTasks) * 100 
            : 0;
          
          resolve(stats);
        };
        
        milestoneRequest.onerror = () => reject(milestoneRequest.error);
      };
      
      taskRequest.onerror = () => reject(taskRequest.error);
    });
  },

  // Search functionality
  searchTasks: async (userId, searchTerm) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['tasks'], 'readonly');
      const store = transaction.objectStore('tasks');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        const tasks = request.result;
        const searchResults = tasks.filter(task => 
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        resolve(searchResults);
      };
      request.onerror = () => reject(request.error);
    });
  },

  // Backup and restore
  exportData: async (userId) => {
    const db = await DatabaseService.init();
    return new Promise(async (resolve, reject) => {
      try {
        const [user, tasks, milestones] = await Promise.all([
          new Promise((resolve, reject) => {
            const transaction = db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const request = store.get(userId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          }),
          DatabaseService.getTasks(userId),
          DatabaseService.getMilestones(userId)
        ]);

        resolve({
          user,
          tasks,
          milestones,
          exportDate: new Date().toISOString()
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  importData: async (data) => {
    const db = await DatabaseService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        ['users', 'tasks', 'milestones'],
        'readwrite'
      );

      try {
        // Import user
        const userStore = transaction.objectStore('users');
        userStore.put(data.user);

        // Import tasks
        const taskStore = transaction.objectStore('tasks');
        data.tasks.forEach(task => taskStore.put(task));

        // Import milestones
        const milestoneStore = transaction.objectStore('milestones');
        data.milestones.forEach(milestone => milestoneStore.put(milestone));

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      } catch (error) {
        reject(error);
      }
    });
  }
};

export default DatabaseService; 