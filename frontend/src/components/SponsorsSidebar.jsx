// SponsorsSidebar.jsx
import React from 'react';

const sponsors = [
  {
    id: 1,
    image: '/sponsor1.jpg',
    title: 'Ad Title 1',
    description: 'Shop now and save big!',
    url: '#',
  },
  {
    id: 2,
    image: '/sponsor2.jpeg',
    title: 'Ad Title 2',
    description: 'Discover the latest trends!',
    url: '#',
  },
  {
    id: 3,
    image: '/sponsor3.jpg',
    title: 'Get rewarded for your creativity',
    description: 'Upgrade your gadgets today!',
    url: '#',
  },
];

const SponsorsSidebar = () => {
  return (
    <aside className="w-[400px] mr-7 fixed right-0 p-4 mt-16 dark:bg-[#1b1b1c] bg-[#f2f4f7] rounded-lg hidden md:block">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Sponsored</h2>
      <div className="space-y-4">
        {sponsors.map((sponsor) => (
          <a
            key={sponsor.id}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-4 hover:bg-gray-200 dark:hover:bg-[#262829] p-2 rounded transition"
          >
            <img
              src={sponsor.image}
              alt={sponsor.title}
              className="w-28 h-28 object-cover rounded"
            />
            <div>
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-300">{sponsor.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{sponsor.description}</p>
            </div>
          </a>
        ))}
      </div>
    </aside>
  );
};

export default SponsorsSidebar;
