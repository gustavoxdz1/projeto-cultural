import { Prisma } from '../../generated/prisma/client';

type ErrorResponse = {
  status: number;
  body: {
    message: string;
    code: string;
    details?: Record<string, unknown>;
  };
};

function getUniqueFields(meta: Prisma.PrismaClientKnownRequestError['meta']) {
  const target = meta?.target;

  if (!target) {
    return [];
  }

  if (Array.isArray(target)) {
    return target.map(String);
  }

  return [String(target)];
}

export function getPrismaErrorResponse(error: Prisma.PrismaClientKnownRequestError): ErrorResponse {
  switch (error.code) {
    case 'P2002': {
      const fields = getUniqueFields(error.meta);

      return {
        status: 409,
        body: {
          code: error.code,
          message:
            fields.length > 0
              ? `Já existe um registro com o mesmo valor para: ${fields.join(', ')}.`
              : 'Já existe um registro com os mesmos dados.',
          details: fields.length > 0 ? { fields } : undefined,
        },
      };
    }

    case 'P2003':
      return {
        status: 409,
        body: {
          code: error.code,
          message: 'Não foi possível concluir a operação porque existem registros relacionados.',
        },
      };

    case 'P2025':
      return {
        status: 404,
        body: {
          code: error.code,
          message: 'Registro não encontrado.',
        },
      };

    default:
      return {
        status: 400,
        body: {
          code: error.code,
          message: 'Não foi possível concluir a operação no banco de dados.',
        },
      };
  }
}
