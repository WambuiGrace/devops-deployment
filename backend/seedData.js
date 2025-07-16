const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Post = require('./models/Post');
const Category = require('./models/Category');

const sampleData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@pixelpulse.com',
      password: hashedPassword,
      isAdmin: true,
    });

    // Create regular user
    const hashedPassword2 = await bcrypt.hash('user123', 12);
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword2,
      isAdmin: false,
    });

    // Create categories
    const categories = [
      { name: 'Gaming News', description: 'Latest gaming news and updates' },
      { name: 'Game Reviews', description: 'In-depth game reviews' },
      { name: 'Hardware Reviews', description: 'Gaming hardware reviews' },
      { name: 'Gaming Tips', description: 'Tips and tricks for gamers' },
      { name: 'Esports', description: 'Esports news and updates' },
      { name: 'Industry News', description: 'Gaming industry news' },
      { name: 'Other', description: 'Other gaming related content' },
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log('Categories created:', createdCategories.length);

    // Create sample posts
    const samplePosts = [
      {
        title: 'The Future of Gaming: What to Expect in 2025',
        content: `Gaming technology continues to evolve at an unprecedented pace. As we move through 2025, several key trends are shaping the future of interactive entertainment.

Virtual Reality (VR) has finally reached mainstream adoption with more affordable headsets and compelling content. The integration of AI-powered NPCs is creating more immersive and dynamic gaming experiences than ever before.

Cloud gaming services are revolutionizing how we access and play games, making high-end gaming accessible to anyone with a stable internet connection. Meanwhile, the rise of blockchain gaming and NFTs continues to create new economic models within virtual worlds.

The gaming industry is also seeing unprecedented growth in mobile gaming, with mobile titles now generating more revenue than traditional console and PC games combined.

As we look ahead, the convergence of AI, VR, cloud computing, and blockchain technology promises to create gaming experiences that were unimaginable just a few years ago.`,
        summary: 'Exploring the latest trends shaping the gaming industry in 2025, from VR mainstream adoption to AI-powered NPCs and cloud gaming revolution.',
        category: 'Gaming News',
        user: adminUser._id,
        image: '',
        likes: [regularUser._id],
        comments: [
          {
            text: 'Great insights! VR gaming has really taken off this year.',
            user: regularUser._id,
            createdAt: new Date(),
          }
        ],
      },
      {
        title: 'Cyberpunk 2077: Phantom Liberty - A Redemption Story',
        content: `CD Projekt Red has truly redeemed themselves with the Phantom Liberty expansion for Cyberpunk 2077. After the rocky launch of the base game, this expansion shows what the studio is truly capable of.

The expansion features a gripping spy thriller narrative that feels distinctly different from the main campaign. Keanu Reeves returns as Johnny Silverhand, and his performance is as captivating as ever.

Technical improvements are immediately noticeable. The game runs smoother, looks better, and the AI behavior has been significantly enhanced. Night City finally feels alive in the way it was originally promised.

The new Dogtown district is beautifully crafted, offering both vertical and horizontal exploration opportunities. The side quests feel meaningful and contribute to the overall narrative in satisfying ways.

Combat has been refined with new weapons, cyberware, and vehicle options. The stealth mechanics work properly now, making different playstyles genuinely viable.

Rating: 9/10 - A masterclass in how to turn around a troubled game.`,
        summary: 'An in-depth review of Cyberpunk 2077: Phantom Liberty expansion, examining how CD Projekt Red redeemed their troubled masterpiece.',
        category: 'Game Reviews',
        user: adminUser._id,
        image: '',
        likes: [regularUser._id, adminUser._id],
        comments: [],
      },
      {
        title: 'Building the Ultimate Gaming Setup: 2025 Hardware Guide',
        content: `Building a gaming PC in 2025 offers more options and better performance per dollar than ever before. Here's our comprehensive guide to creating the ultimate gaming setup.

**CPU Recommendations:**
- Budget: AMD Ryzen 5 7600X
- Mid-range: Intel Core i5-13600K
- High-end: AMD Ryzen 9 7950X3D

**GPU Selection:**
The graphics card remains the most important component for gaming performance.
- 1080p Gaming: RTX 4060 Ti or RX 7700 XT
- 1440p Gaming: RTX 4070 Super or RX 7800 XT
- 4K Gaming: RTX 4080 Super or RX 7900 XTX

**Memory and Storage:**
32GB of DDR5 RAM is now the sweet spot for gaming, with speeds of 5600MHz or higher recommended. For storage, a 1TB NVMe SSD should be considered the minimum, with PCIe 4.0 drives offering the best performance.

**Peripherals Matter:**
Don't overlook the importance of a good gaming monitor, mechanical keyboard, and high-DPI gaming mouse. These components directly impact your gaming experience.

**Future-Proofing:**
Consider upcoming technologies like DDR5, PCIe 5.0, and USB4 when selecting your motherboard and components.`,
        summary: 'A comprehensive 2025 guide to building the ultimate gaming PC, covering CPUs, GPUs, memory, storage, and essential peripherals.',
        category: 'Hardware Reviews',
        user: regularUser._id,
        image: '',
        likes: [],
        comments: [
          {
            text: 'This guide helped me build my new rig! Thanks!',
            user: adminUser._id,
            createdAt: new Date(),
          }
        ],
      },
      {
        title: '10 Pro Tips to Improve Your FPS Gaming Skills',
        content: `Whether you're new to first-person shooters or looking to take your skills to the next level, these professional tips will help you dominate the competition.

**1. Master Your Sensitivity Settings**
Find the right mouse sensitivity that allows for both precise aiming and quick 180-degree turns. Most pros use lower sensitivities for better precision.

**2. Practice Crosshair Placement**
Keep your crosshair at head level and pre-aim common angles. This reduces the distance you need to move your mouse when enemies appear.

**3. Learn the Maps**
Map knowledge is crucial. Know common angles, callouts, and rotation routes. This knowledge often matters more than raw aim.

**4. Use Sound to Your Advantage**
Invest in good headphones and learn to identify footsteps, reloads, and other audio cues that can give you tactical advantages.

**5. Warm Up Before Playing**
Spend 10-15 minutes in aim trainers or deathmatch before jumping into competitive games.

**6. Review Your Gameplay**
Record and analyze your deaths. Understanding why you died is key to improvement.

**7. Stay Calm Under Pressure**
Develop mental resilience. Panic leads to poor decision-making and missed shots.

**8. Communicate Effectively**
Clear, concise callouts can turn the tide of rounds. Learn proper communication protocols.

**9. Manage Your Economy**
In tactical shooters, understanding when to buy, save, or force-buy is crucial for team success.

**10. Stay Consistent**
Regular practice is more effective than marathon sessions. Consistency builds muscle memory and game sense.`,
        summary: '10 professional tips to elevate your FPS gaming skills, covering aim, map knowledge, communication, and mental game strategies.',
        category: 'Gaming Tips',
        user: adminUser._id,
        image: '',
        likes: [regularUser._id],
        comments: [],
      },
      {
        title: 'The Rise of Mobile Esports: A New Era of Competition',
        content: `Mobile esports has evolved from a niche market to a global phenomenon, attracting millions of viewers and offering substantial prize pools.

Games like PUBG Mobile, Mobile Legends, and Honor of Kings have established themselves as legitimate esports titles with professional leagues and international tournaments.

The accessibility of mobile gaming has democratized esports participation. Players no longer need expensive gaming PCs or consoles to compete at the highest levels.

Major tournaments now offer prize pools rivaling traditional PC esports, with some mobile tournaments exceeding $2 million in total prizes.

The infrastructure supporting mobile esports continues to grow, with dedicated mobile gaming venues and specialized streaming platforms emerging worldwide.

Looking ahead, mobile esports is positioned to become the dominant form of competitive gaming, especially in emerging markets where mobile phones are the primary gaming platform.`,
        summary: 'Exploring the explosive growth of mobile esports and its impact on the competitive gaming landscape worldwide.',
        category: 'Esports',
        user: regularUser._id,
        image: '',
        likes: [],
        comments: [],
      }
    ];

    const createdPosts = await Post.insertMany(samplePosts);
    console.log('Sample posts created:', createdPosts.length);

    console.log('\n=== Sample Data Created Successfully ===');
    console.log('Admin User:', {
      email: 'admin@pixelpulse.com',
      password: 'admin123',
      isAdmin: true
    });
    console.log('Regular User:', {
      email: 'john@example.com', 
      password: 'user123',
      isAdmin: false
    });
    console.log('Categories:', createdCategories.length);
    console.log('Posts:', createdPosts.length);

    process.exit(0);
  } catch (error) {
    console.error('Error creating sample data:', error);
    process.exit(1);
  }
};

sampleData();
