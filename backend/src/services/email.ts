import { Resend } from "resend";

const chaveApi = process.env.RESEND_API_KEY ;

if (!chaveApi) {
  throw new Error("A chave de API do Resend não está definida.");
}

export const resend = new Resend(chaveApi);

type DadosEmail = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function enviarEmail({to, subject, html, text}: DadosEmail) {
    const {data, error} = await resend.emails.send({
        from: process.env.EMAIL_FROM || "Portal Cultural <no-reply@updates.seudominio.com>",
        to: [to],
        subject: subject,
        html: html,
        text: text,
    });
    
    if (error) {
        console.error("Erro ao enviar email:", error);
        throw new Error("Não foi possível enviar o email.");
    }

    return data;
    
}