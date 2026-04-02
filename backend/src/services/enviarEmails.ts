import { enviarEmail } from './email';
import { env } from '../config/env';

export async function enviarEmailBoasVindas(nome: string, email: string) {
  return enviarEmail({
    to: email,
    subject: 'Bem-vindo à SpotTech!',
    text: `Olá, ${nome}! Seu cadastro foi realizado com sucesso. Seja bem-vindo à SpotTech.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Bem-vindo à SpotTech, ${nome}!</h2>
        <p>Seu cadastro foi realizado com sucesso. Estamos felizes em ter você aqui.</p>
        <p>Explore locais, descubra novos espaços e contribua com sugestões para ampliar o catálogo.</p>
      </div>
    `,
  });
}

export async function enviarEamailRecuperacaoSenha(name: string, email: string, token: string) {
  const linkRecuperacao = `${env.frontendUrl}/recuperar-senha?token=${token}`;

  return enviarEmail({
    to: email,
    subject: 'Recuperação de senha - SpotTech',
    text: `Olá, ${name}! Para recuperar sua senha, clique no link a seguir: ${linkRecuperacao}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Recuperação de senha - SpotTech</h2>
        <p>Olá, ${name}!</p>
        <p>Para recuperar sua senha, clique no link abaixo:</p>
        <a href="${linkRecuperacao}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Recuperar senha</a>
        <p>Se você não solicitou a recuperação de senha, pode ignorar este e-mail.</p>
      </div>
    `,
  });
}
