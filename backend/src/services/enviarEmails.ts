import { enviarEmail } from "./email";
import { env } from "../config/env";

export async function enviarEmailBoasVindas(nome: string, email: string) {
    return enviarEmail({
        to: email,
        subject: "Bem-vindo ao Portal Cultural de Manaus!",
        text: `Olá, ${nome}! Seu cadastro foi realizado com sucesso. Seja bem-vindo ao Portal Cultural de Manaus!`,
        html: `
           <div style="font-family: Arial, sans-serif; line-height: 1.6; ">
           <h2>Bem-vindo ao Portal Cultural de Manaus, ${nome}!</h2>
           <p>Seu cadastro foi realizado com sucesso.Estamos felizes em ter você aqui</p>
           <p>Busque eventos, exposições, shows e muito mais que Manaus tem a oferecer. Se já é de Manaus, você pode sugerir novos locais!</p>
        `
    });
}

export async function enviarEamailRecuperacaoSenha(
    name: string,
    email: string,
    token: string
) {
    const linkRecuperacao = `${env.frontendUrl}/recuperar-senha?token=${token}`;
    
    return enviarEmail({
        to: email,
        subject: "Recuperação de senha - Portal Cultural de Manaus",
        text: `Olá, ${name}! Para recuperar sua senha, clique no link a seguir: ${linkRecuperacao}`,
        html: `
           <div style="font-family: Arial, sans-serif; line-height: 1.6; ">
           <h2>Recuperação de senha - Portal Cultural de Manaus</h2>
              <p>Olá, ${name}!</p>
              <p>Para recuperar sua senha, clique no link abaixo:</p>

              <a href="${linkRecuperacao}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Recuperar Senha</a>

              <p>Se você não solicitou a recuperação de senha, por favor ignore este email
          </div>
        `
    });
}
