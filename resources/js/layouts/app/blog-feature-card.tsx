import React from 'react'
//https://pbs.twimg.com/profile_images/1950218390741618688/72447Y7e_400x400.jpg
import { FlipCard } from '@/components/animate-ui/components/community/flip-card';

const data = {
    name: 'Animate UI',
    username: 'animate_ui',
    image:'public/IMG/Cards/C-the-perfect-insider.jpg',
    bio: 'A fully animated, open-source component distribution built with React, TypeScript, Tailwind CSS, and Motion.',
    stats: { following: 200, followers: 2900, posts: 120 },
    socialLinks: {
        linkedin: 'https://linkedin.com',
        github: 'https://github.com',
        twitter: 'https://twitter.com',
    },
};

export const BlogFeatureCard = () => {
    return <FlipCard data={data} />;
};