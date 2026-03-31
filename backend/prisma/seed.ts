import bcrypt from 'bcrypt';
import { prisma } from '../src/lib/prisma';
import { slugify } from '../src/utils/slug';

function wikimediaRedirect(fileName: string) {
  return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(fileName)}`;
}

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
        description:
          'Símbolo maior da Belle Époque manauara, o Teatro Amazonas reúne arquitetura histórica, visitas guiadas e uma programação que inclui concertos, óperas e espetáculos ao longo do ano.',
        address: 'Largo de São Sebastião, s/n, Centro',
        neighborhood: 'Centro',
        latitude: -3.1303,
        longitude: -60.023,
        imageUrl: wikimediaRedirect('Teatro Amazonas - Manaus.jpg'),
        categoryId: cultura.id,
      },
      {
        name: 'Largo de São Sebastião',
        description:
          'Praça histórica no coração do centro antigo de Manaus, cercada por bares, igreja, galerias e pelo Teatro Amazonas, muito procurada para passeios, fotos e vida cultural.',
        address: 'Largo de São Sebastião, Centro',
        neighborhood: 'Centro',
        imageUrl: wikimediaRedirect('Largo São Sebastião - panoramio.jpg'),
        categoryId: lazer.id,
      },
      {
        name: 'Mercado Municipal Adolpho Lisboa',
        description:
          'Mercado histórico às margens do Rio Negro, conhecido pela arquitetura inspirada em Les Halles e pela variedade de produtos regionais, artesanato, peixes, ervas e sabores amazônicos.',
        address: 'Rua dos Barés, 46, Centro',
        neighborhood: 'Centro',
        imageUrl: wikimediaRedirect('Mercado Adolpho Lisboa.jpg'),
        categoryId: cultura.id,
      },
      {
        name: 'Museu da Cidade de Manaus (Paço da Liberdade)',
        description:
          'Instalado no histórico Paço da Liberdade, o museu apresenta a formação de Manaus com exposições interativas, memória urbana e experiências que ajudam o visitante a entender a identidade da cidade.',
        address: 'Rua Gabriel Salgado, s/n, Praça Dom Pedro II, Centro',
        neighborhood: 'Centro',
        imageUrl: wikimediaRedirect('Museu da Cidade de Manaus (Paço da Liberdade), Manaus, Brazil 05.jpg'),
        categoryId: cultura.id,
      },
      {
        name: 'Palacete Provincial',
        description:
          'Edifício centenário que abriga museus, pinacoteca e coleções históricas importantes do Amazonas, sendo uma das visitas mais ricas para quem quer conhecer arte, memória e patrimônio.',
        address: 'Praça Heliodoro Balbi, s/n, Centro',
        neighborhood: 'Centro',
        imageUrl: wikimediaRedirect('Fachada do Palacete Provincial.jpg'),
        categoryId: cultura.id,
      },
      {
        name: 'Arena da Amazônia',
        description:
          'Principal arena multiuso de Manaus, criada para a Copa do Mundo de 2014 e hoje utilizada em partidas, shows, grandes eventos e roteiros turísticos pela cidade.',
        address: 'Av. Constantino Nery, Flores',
        neighborhood: 'Flores',
        latitude: -3.0833,
        longitude: -60.0286,
        imageUrl: wikimediaRedirect('Arena da Amazônia.jpg'),
        categoryId: esporte.id,
      },
      {
        name: 'Ponta Negra',
        description:
          'Um dos cartões-postais mais frequentados de Manaus, com praia de rio, calçadão, mirantes e pôr do sol muito procurado por moradores e turistas.',
        address: 'Av. Coronel Teixeira, Ponta Negra',
        neighborhood: 'Ponta Negra',
        latitude: -3.0718,
        longitude: -60.1033,
        imageUrl: wikimediaRedirect('2019-10-05 Ponta Negra (Manaus).jpg'),
        categoryId: lazer.id,
      },
      {
        name: 'Museu da Amazônia (MUSA)',
        description:
          'Espaço de cultura e ciência dentro da Reserva Florestal Adolpho Ducke, com trilhas, exposições e a famosa torre de observação da copa das árvores, muito procurado por quem quer vivenciar a floresta em Manaus.',
        address: 'Avenida Margarita, 6305, Cidade de Deus',
        neighborhood: 'Cidade de Deus',
        imageUrl: wikimediaRedirect('Visita ao Museu da Amazônia (MUSA) (54147332524).jpg'),
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
