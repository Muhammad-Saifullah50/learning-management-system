const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

const main = async () => {
    try {
        await database.category.createMany({
            data: [
                { name: 'Computer Science' },
                { name: 'Communication Skills' },
                { name: 'Time Management' },
                { name: 'Leadership Skills' },
                { name: 'Financial Management' },
                { name: ' Marketing Strategies' },
                { name: ' Foreign Languages' },
                { name: 'Web Developement' },
                { name: 'Generative AI' },
            ],
        })

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database ', error);
    } finally {
        await database.$disconnect();
    }
}

main();