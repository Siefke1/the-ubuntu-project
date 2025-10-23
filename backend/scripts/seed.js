const { PrismaClient, UserRole } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Sample data arrays
const firstNames = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Sage', 'River',
  'Blake', 'Cameron', 'Drew', 'Emery', 'Finley', 'Hayden', 'Jamie', 'Kendall', 'Logan', 'Parker',
  'Reese', 'Sawyer', 'Skyler', 'Tatum', 'Tyler', 'Valentine', 'Winter', 'Zion', 'Ari', 'Blake',
  'Charlie', 'Dakota', 'Ellis', 'Frankie', 'Gray', 'Harper', 'Indigo', 'Jules', 'Kai', 'Lane',
  'Marlowe', 'Noah', 'Ocean', 'Peyton', 'Quinn', 'Rowan', 'Sage', 'Tatum', 'Vale', 'Wren'
];

const lastNames = [
  'Anderson', 'Brown', 'Clark', 'Davis', 'Evans', 'Foster', 'Garcia', 'Harris', 'Jackson', 'Johnson',
  'King', 'Lee', 'Miller', 'Nelson', 'Owen', 'Parker', 'Quinn', 'Roberts', 'Smith', 'Taylor',
  'White', 'Wilson', 'Young', 'Adams', 'Baker', 'Campbell', 'Carter', 'Cooper', 'Edwards', 'Green',
  'Hall', 'Hill', 'Hughes', 'Jones', 'Martin', 'Moore', 'Murphy', 'Patterson', 'Reed', 'Richardson',
  'Robinson', 'Rodriguez', 'Scott', 'Stewart', 'Thompson', 'Turner', 'Walker', 'Ward', 'Watson', 'Williams'
];

const categories = [
  {
    name: 'General Discussion',
    slug: 'general-discussion',
    description: 'General Ubuntu discussions, community chat, and off-topic conversations',
    color: '#4CAF50',
    allowedRoles: ['BEGINNER', 'CONTRIBUTOR', 'ADMIN'],
    isPublic: true,
    requiresApproval: false,
    sortOrder: 1
  },
  {
    name: 'Introductuons',
    slug: 'introductions',
    description: 'Let us know who you are and how you got here. Or simply tell us a joke.',
    color: '#2196F3',
    allowedRoles: ['BEGINNER', 'CONTRIBUTOR', 'ADMIN'],
    isPublic: true,
    requiresApproval: false,
    sortOrder: 2
  },
  {
    name: 'FAQ',
    slug: 'faq',
    description: 'You must have questions. Some we might know the answer to, some we might have to find together.',
    color: '#FF9800',
    allowedRoles: ['BEGINNER', 'CONTRIBUTOR', 'ADMIN'],
    isPublic: true,
    requiresApproval: false,
    sortOrder: 3
  },
  {
    name: 'TODO',
    slug: 'todo',
    description: 'Looking to get busy? This is a good place to start looking for some ways to contribute.',
    color: '#9C27B0',
    allowedRoles: ['BEGINNER', 'CONTRIBUTOR', 'ADMIN'],
    isPublic: true,
    requiresApproval: false,
    sortOrder: 4
  },
  {
    name: 'Dev Space',
    slug: 'dev-space',
    description: 'If you would like to get involved in the development of our platform, or any other digital product, this is the place.',
    color: '#F44336',
    allowedRoles: ['CONTRIBUTOR', 'ADMIN'],
    isPublic: true,
    requiresApproval: false,
    sortOrder: 5
  },
  {
    name: 'Development',
    slug: 'development',
    description: 'Programming, development tools, and software development discussions',
    color: '#00BCD4',
    allowedRoles: ['BEGINNER', 'CONTRIBUTOR', 'ADMIN'],
    isPublic: true,
    requiresApproval: false,
    sortOrder: 6
  },
  {
    name: 'Security',
    slug: 'security',
    description: 'Security best practices, vulnerabilities, and system hardening',
    color: '#795548',
    allowedRoles: ['CONTRIBUTOR', 'ADMIN'],
    isPublic: true,
    requiresApproval: false,
    sortOrder: 7
  },
  {
    name: 'Troubleshooting',
    slug: 'troubleshooting',
    description: 'System issues, bugs, and problem-solving discussions',
    color: '#607D8B',
    allowedRoles: ['BEGINNER', 'CONTRIBUTOR', 'ADMIN'],
    isPublic: true,
    requiresApproval: false,
    sortOrder: 8
  },
  {
    name: 'Announcements',
    slug: 'announcements',
    description: 'Official Ubuntu announcements, releases, and important updates',
    color: '#E91E63',
    allowedRoles: ['ADMIN'],
    isPublic: true,
    requiresApproval: true,
    sortOrder: 9
  },
  {
    name: 'Community Projects',
    slug: 'community-projects',
    description: 'Community-driven projects, contributions, and collaborative efforts',
    color: '#3F51B5',
    allowedRoles: ['CONTRIBUTOR', 'ADMIN'],
    isPublic: true,
    requiresApproval: false,
    sortOrder: 10
  }
];

const postTitles = [
  'How to dual boot Ubuntu with Windows 11?',
  'Best practices for Ubuntu server security',
  'Installing NVIDIA drivers on Ubuntu 22.04',
  'Python development environment setup',
  'Ubuntu performance optimization tips',
  'Docker installation and configuration',
  'Setting up a LAMP stack on Ubuntu',
  'Ubuntu desktop customization guide',
  'Troubleshooting WiFi connectivity issues',
  'Backup strategies for Ubuntu systems',
  'Installing and configuring Apache',
  'Ubuntu package management best practices',
  'Setting up SSH keys for secure access',
  'Ubuntu firewall configuration',
  'Installing and using Git on Ubuntu',
  'Ubuntu system monitoring tools',
  'Setting up a development environment',
  'Ubuntu disk partitioning guide',
  'Troubleshooting boot issues',
  'Ubuntu networking configuration',
  'Installing and configuring MySQL',
  'Ubuntu system updates and maintenance',
  'Setting up a web server',
  'Ubuntu user management',
  'Ubuntu system logs and monitoring',
  'Installing and using VSCode',
  'Ubuntu virtual machine setup',
  'Troubleshooting display issues',
  'Ubuntu command line tips',
  'Setting up a database server',
  'Ubuntu system backup and restore',
  'Installing and configuring PHP',
  'Ubuntu security hardening',
  'Setting up a development workflow',
  'Ubuntu system performance tuning',
  'Installing and using Docker Compose',
  'Ubuntu network troubleshooting',
  'Setting up a local development environment',
  'Ubuntu system administration basics',
  'Installing and configuring Redis',
  'Ubuntu system maintenance tasks',
  'Setting up a CI/CD pipeline',
  'Ubuntu system optimization',
  'Installing and using Node.js',
  'Ubuntu system monitoring setup',
  'Setting up a development team environment',
  'Ubuntu system security audit',
  'Installing and configuring PostgreSQL',
  'Ubuntu system backup automation',
  'Setting up a production environment'
];

const postContents = [
  'I\'m having trouble setting up dual boot with Windows 11. Can anyone help me with the partitioning process?',
  'What are the essential security measures I should implement on my Ubuntu server?',
  'I need help installing NVIDIA drivers. The system keeps using the open-source drivers instead.',
  'What\'s the best way to set up a Python development environment on Ubuntu?',
  'My Ubuntu system seems to be running slowly. Any optimization tips?',
  'I\'m new to Docker. Can someone guide me through the installation and basic usage?',
  'I need to set up a LAMP stack for a web project. What\'s the recommended approach?',
  'How can I customize my Ubuntu desktop to make it more productive?',
  'My WiFi keeps disconnecting. I\'ve tried several solutions but nothing works.',
  'What\'s the best backup strategy for my Ubuntu system? I have important data.',
  'I\'m setting up a web server with Apache. Any configuration tips?',
  'What are the best practices for managing packages on Ubuntu?',
  'I need to set up SSH keys for secure server access. Can someone walk me through it?',
  'How do I configure the firewall on Ubuntu? What ports should I open?',
  'I\'m new to Git. What\'s the best way to install and configure it on Ubuntu?',
  'What tools can I use to monitor my Ubuntu system performance?',
  'I need to set up a development environment for my team. Any recommendations?',
  'I\'m confused about disk partitioning. Can someone explain the best practices?',
  'My system won\'t boot after an update. How can I troubleshoot this?',
  'I need help configuring networking on my Ubuntu server.',
  'I\'m setting up a database server. Should I use MySQL or PostgreSQL?',
  'How often should I update my Ubuntu system? What\'s the best approach?',
  'I need to set up a web server for production. What\'s the recommended stack?',
  'How do I manage users and permissions on Ubuntu?',
  'Where can I find system logs to troubleshoot issues?',
  'I want to use VSCode for development. How do I install and configure it?',
  'I need to run Ubuntu in a virtual machine. What\'s the best setup?',
  'My display resolution is wrong. How can I fix this?',
  'I\'m new to the command line. What are some essential commands to learn?',
  'I need to set up a database for my application. What\'s the best approach?',
  'How can I automate backups for my Ubuntu system?',
  'I need to install PHP for web development. What\'s the recommended version?',
  'What security measures should I implement to harden my Ubuntu system?',
  'I need to set up a development workflow for my team. Any suggestions?',
  'My system is using too much RAM. How can I optimize it?',
  'I want to use Docker Compose for my projects. How do I get started?',
  'I\'m having network connectivity issues. How can I troubleshoot?',
  'I need to set up a local development environment. What\'s the best approach?',
  'I\'m new to system administration. What are the basics I should know?',
  'I need to install Redis for caching. What\'s the best way to set it up?',
  'What maintenance tasks should I perform regularly on Ubuntu?',
  'I need to set up a CI/CD pipeline. What tools should I use?',
  'How can I optimize my Ubuntu system for better performance?',
  'I want to use Node.js for development. How do I install and configure it?',
  'I need to monitor my Ubuntu system. What tools are available?',
  'I need to set up a development environment for a team. Any recommendations?',
  'How can I perform a security audit on my Ubuntu system?',
  'I need to install PostgreSQL for my database needs. What\'s the best approach?',
  'How can I automate system backups? What tools should I use?',
  'I need to set up a production environment. What are the best practices?'
];

const replyContents = [
  'Great question! I had the same issue last week.',
  'This worked perfectly for me. Thanks for sharing!',
  'I\'m also interested in this. Following for updates.',
  'Have you tried checking the system logs?',
  'This is a common issue. Here\'s what worked for me...',
  'I recommend using the official documentation for this.',
  'You might want to check the package dependencies first.',
  'I\'ve been using this approach for months without issues.',
  'This is exactly what I was looking for. Thank you!',
  'I had a similar problem. Try restarting the service.',
  'This is a known issue with the current version.',
  'I found a workaround that might help you.',
  'Have you considered using an alternative approach?',
  'This is a great solution. I\'ll definitely try this.',
  'I\'m not sure about this approach. Have you tested it?',
  'This is very helpful. Thanks for the detailed explanation.',
  'I encountered this same issue yesterday.',
  'This looks promising. I\'ll give it a try.',
  'I\'ve been struggling with this for days. This helps!',
  'This is a bit complex for me. Can you simplify it?',
  'I\'m new to this. Can you explain it step by step?',
  'This is exactly what I needed. Much appreciated!',
  'I\'m having trouble following this. Any additional help?',
  'This is a solid solution. I recommend it.',
  'I\'ve tried this before but it didn\'t work for me.',
  'This is very informative. Thanks for sharing!',
  'I\'m not sure this is the right approach.',
  'This is helpful but I need more details.',
  'I\'ve been looking for this solution. Thank you!',
  'This is too advanced for me. Any beginner tips?',
  'This is perfect! I\'ll implement this right away.',
  'I\'m still confused. Can you provide more examples?',
  'This is a great starting point. I\'ll explore further.',
  'I\'ve been using this method for years. It works well.',
  'This is very clear. Thanks for the explanation.',
  'I\'m not sure if this applies to my situation.',
  'This is helpful but I need to understand the basics first.',
  'I\'ve tried this approach before. It has some limitations.',
  'This is exactly what I was looking for. Great job!',
  'I\'m having trouble implementing this. Any tips?',
  'This is a good solution but I need more context.',
  'I\'ve been struggling with this. This gives me hope!',
  'This is very detailed. I appreciate the effort.',
  'I\'m not sure this will work in my environment.',
  'This is helpful but I need to see it in action.',
  'I\'ve been looking for this information. Thank you!',
  'This is a bit overwhelming. Can you break it down?',
  'This is very useful. I\'ll bookmark this.',
  'I\'m still learning. This helps me understand better.',
  'This is a comprehensive solution. Well done!'
];

const tags = [
  'ubuntu', 'linux', 'tutorial', 'help', 'beginner', 'advanced', 'server', 'desktop',
  'installation', 'configuration', 'troubleshooting', 'security', 'development',
  'networking', 'hardware', 'software', 'docker', 'apache', 'nginx', 'mysql',
  'postgresql', 'python', 'nodejs', 'git', 'ssh', 'firewall', 'backup', 'monitoring',
  'performance', 'optimization', 'virtualization', 'containers', 'ci-cd', 'automation',
  'scripting', 'bash', 'systemd', 'logs', 'debugging', 'updates', 'packages',
  'repositories', 'drivers', 'graphics', 'audio', 'wifi', 'bluetooth', 'usb',
  'storage', 'filesystem', 'permissions', 'users', 'groups', 'sudo', 'root'
];

// Helper functions
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateUsername(firstName, lastName) {
  const randomNum = Math.floor(Math.random() * 1000);
  return `${firstName.toLowerCase()}${lastName.toLowerCase()}${randomNum}`;
}

function generateEmail(firstName, lastName, index) {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'protonmail.com'];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@${getRandomElement(domains)}`;
}

async function clearDatabase() {
  console.log('🗑️  Clearing database...');

  // Delete in correct order due to foreign key constraints
  await prisma.like.deleteMany();
  await prisma.reply.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Database cleared');
}

async function seedCategories() {
  console.log('📂 Creating categories...');

  for (const categoryData of categories) {
    await prisma.category.create({
      data: categoryData
    });
  }

  console.log(`✅ Created ${categories.length} categories`);
}

async function seedUsers() {
  console.log('👥 Creating users...');

  const users = [];
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@ubuntu-forum.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isVerified: true,
      isActive: true
    }
  });
  users.push(adminUser);

  // Create contributor users (50)
  for (let i = 0; i < 50; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const user = await prisma.user.create({
      data: {
        email: generateEmail(firstName, lastName, i + 1),
        username: generateUsername(firstName, lastName),
        password: hashedPassword,
        firstName,
        lastName,
        role: UserRole.CONTRIBUTOR,
        isVerified: Math.random() > 0.1, // 90% verified
        isActive: Math.random() > 0.05, // 95% active
        bio: Math.random() > 0.7 ? `Ubuntu enthusiast and ${getRandomElement(['developer', 'sysadmin', 'student', 'teacher', 'engineer'])}` : null,
        lastLogin: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date())
      }
    });
    users.push(user);
  }

  // Create beginner users (449)
  for (let i = 0; i < 449; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const user = await prisma.user.create({
      data: {
        email: generateEmail(firstName, lastName, i + 51), // Start from 51 to avoid conflicts
        username: generateUsername(firstName, lastName),
        password: hashedPassword,
        firstName,
        lastName,
        role: UserRole.BEGINNER,
        isVerified: Math.random() > 0.2, // 80% verified
        isActive: Math.random() > 0.1, // 90% active
        bio: Math.random() > 0.8 ? `New to Ubuntu, learning ${getRandomElement(['programming', 'system administration', 'web development', 'data science'])}` : null,
        lastLogin: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date())
      }
    });
    users.push(user);
  }

  console.log(`✅ Created ${users.length} users (1 admin, 50 contributors, 449 beginners)`);
  return users;
}

async function seedPosts(users, categories) {
  console.log('📝 Creating posts...');

  const posts = [];
  const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
  const endDate = new Date();

  // Create 800 posts
  for (let i = 0; i < 800; i++) {
    const user = getRandomElement(users);
    const category = getRandomElement(categories);
    const title = getRandomElement(postTitles);
    const content = getRandomElement(postContents);
    const postTags = getRandomElements(tags, Math.floor(Math.random() * 5) + 1);
    const createdAt = getRandomDate(startDate, endDate);

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: user.id,
        categoryId: category.id,
        tags: postTags,
        isPinned: false, // 5% pinned
        isLocked: Math.random() > 0.98, // 2% locked
        createdAt,
        updatedAt: createdAt
      }
    });

    posts.push(post);

    // Update category post count
    await prisma.category.update({
      where: { id: category.id },
      data: { postCount: { increment: 1 } }
    });
  }

  console.log(`✅ Created ${posts.length} posts`);
  return posts;
}

async function seedReplies(posts, users) {
  console.log('💬 Creating replies...');

  const replies = [];
  const startDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // 60 days ago
  const endDate = new Date();

  // Create 2000 replies
  for (let i = 0; i < 2000; i++) {
    const post = getRandomElement(posts);
    const user = getRandomElement(users);
    const content = getRandomElement(replyContents);
    const createdAt = getRandomDate(new Date(post.createdAt), endDate);

    const reply = await prisma.reply.create({
      data: {
        content,
        authorId: user.id,
        postId: post.id,
        createdAt,
        updatedAt: createdAt
      }
    });

    replies.push(reply);
  }

  console.log(`✅ Created ${replies.length} replies`);
  return replies;
}

async function seedLikes(posts, users) {
  console.log('👍 Creating likes...');

  const likes = [];

  // Create 3000 likes
  for (let i = 0; i < 3000; i++) {
    const post = getRandomElement(posts);
    const user = getRandomElement(users);

    // Check if like already exists
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: user.id,
        postId: post.id
      }
    });

    if (!existingLike) {
      const like = await prisma.like.create({
        data: {
          userId: user.id,
          postId: post.id
        }
      });

      likes.push(like);
    }
  }

  console.log(`✅ Created ${likes.length} likes`);
  return likes;
}

async function main() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    await clearDatabase();

    // Seed categories
    await seedCategories();
    const categories = await prisma.category.findMany();

    // Seed users
    const users = await seedUsers();

    // Seed posts
    const posts = await seedPosts(users, categories);

    // Seed replies
    const replies = await seedReplies(posts, users);

    // Seed likes
    const likes = await seedLikes(posts, users);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${categories.length} categories`);
    console.log(`   • ${users.length} users`);
    console.log(`   • ${posts.length} posts`);
    console.log(`   • ${replies.length} replies`);
    console.log(`   • ${likes.length} likes`);
    console.log('\n🔑 Default login credentials:');
    console.log('   • Admin: admin@ubuntu-forum.com / password123');
    console.log('   • All other users: [generated-email] / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
if (require.main === module) {
  main()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { main };
