import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.user.deleteMany();

  // Criar consultores
  const consultor1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      telefone: '(11) 98765-4321',
      role: 'CONSULTOR',
    },
  });

  const consultor2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'janesmith@gmail.com',
      telefone: '(11) 97654-3210',
      role: 'CONSULTOR',
    },
  });

  console.log('✅ Consultores criados');

  // Criar clientes para consultor1
  const clientesConsultor1 = [
    { name: 'Cliente 1', email: 'cliente1@example.com', telefone: '(11) 91000-0001', cpf: '001.001.001-01', idade: 25, endereco: 'Rua Exemplo, 100 - São Paulo, SP' },
    { name: 'Cliente 2', email: 'cliente2@example.com', telefone: '(11) 91000-0002', cpf: '002.002.002-02', idade: 28, endereco: 'Rua Exemplo, 200 - São Paulo, SP' },
    { name: 'Cliente 3', email: 'cliente3@example.com', telefone: '(11) 91000-0003', cpf: '003.003.003-03', idade: 32, endereco: 'Rua Exemplo, 300 - São Paulo, SP' },
    { name: 'Cliente 4', email: 'cliente4@example.com', telefone: '(11) 91000-0004', cpf: '004.004.004-04', idade: 27, endereco: 'Rua Exemplo, 400 - São Paulo, SP' },
    { name: 'Cliente 5', email: 'cliente5@example.com', telefone: '(11) 91000-0005', cpf: '005.005.005-05', idade: 30, endereco: 'Rua Exemplo, 500 - São Paulo, SP' },
  ];

  for (const cliente of clientesConsultor1) {
    await prisma.user.create({
      data: {
        ...cliente,
        role: 'CLIENT',
        consultorId: consultor1.id,
      },
    });
  }

  // Criar clientes para consultor2
  const clientesConsultor2 = [
    { name: 'Cliente 6', email: 'cliente6@example.com', telefone: '(21) 92000-0006', cpf: '006.006.006-06', idade: 26, endereco: 'Avenida Principal, 600 - Rio de Janeiro, RJ' },
    { name: 'Cliente 7', email: 'cliente7@example.com', telefone: '(21) 92000-0007', cpf: '007.007.007-07', idade: 29, endereco: 'Avenida Principal, 700 - Rio de Janeiro, RJ' },
    { name: 'Cliente 8', email: 'cliente8@example.com', telefone: '(21) 92000-0008', cpf: '008.008.008-08', idade: 31, endereco: 'Avenida Principal, 800 - Rio de Janeiro, RJ' },
    { name: 'Cliente 9', email: 'cliente9@example.com', telefone: '(21) 92000-0009', cpf: '009.009.009-09', idade: 33, endereco: 'Avenida Principal, 900 - Rio de Janeiro, RJ' },
    { name: 'Cliente 10', email: 'cliente10@example.com', telefone: '(21) 92000-0010', cpf: '010.010.010-10', idade: 35, endereco: 'Avenida Principal, 1000 - Rio de Janeiro, RJ' },
  ];

  for (const cliente of clientesConsultor2) {
    await prisma.user.create({
      data: {
        ...cliente,
        role: 'CLIENT',
        consultorId: consultor2.id,
      },
    });
  }

  console.log('✅ Clientes criados');
  console.log('🎉 Seed concluído com sucesso!');
  console.log(`📊 Total: 2 consultores e 10 clientes`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao fazer seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
