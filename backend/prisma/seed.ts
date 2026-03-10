import bcrypt from 'bcrypt';
import { prisma } from '../src/lib/prisma';
import { slugify } from '../src/utils/slug';

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  await prisma.user.upsert({
    where: { email: 'admin@portal.com' },
    update: {
      role: 'ADMIN',
      receiveUpdates: false,
    },
    create: {
      name: 'Administrador',
      email: 'admin@portal.com',
      password: passwordHash,
      role: 'ADMIN',
      receiveUpdates: false,
    },
  });

  const categories = ['Cultura', 'Esporte', 'Lazer'];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: {
        name,
        slug: slugify(name),
      },
    });
  }

  const cultura = await prisma.category.findUnique({
    where: { slug: 'cultura' },
  });

  const esporte = await prisma.category.findUnique({
    where: { slug: 'esporte' },
  });

  const lazer = await prisma.category.findUnique({
    where: { slug: 'lazer' },
  });

  await prisma.suggestion.deleteMany();
  await prisma.place.deleteMany();

  if (cultura && esporte && lazer) {
    const places = [
      {
        name: 'Teatro Amazonas',
        description: 'Um dos principais cartões-postais culturais de Manaus.',
        address: 'Largo de São Sebastião, Centro',
        neighborhood: 'Centro',
        latitude: -3.1303,
        longitude: -60.023,
        categoryId: cultura.id,
      },
      {
        name: 'Arena da Amazônia',
        description: 'Espaço esportivo para grandes eventos e partidas.',
        address: 'Av. Constantino Nery, Flores',
        neighborhood: 'Flores',
        latitude: -3.0833,
        longitude: -60.0286,
        categoryId: esporte.id,
      },
      {
        name: 'Ponta Negra',
        description: 'Área de lazer bastante frequentada em Manaus.',
        address: 'Av. Coronel Teixeira, Ponta Negra',
        neighborhood: 'Ponta Negra',
        latitude: -3.0718,
        longitude: -60.1033,
        categoryId: lazer.id,
      },
    ];

    for (const place of places) {
      await prisma.place.create({
        data: place,
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });