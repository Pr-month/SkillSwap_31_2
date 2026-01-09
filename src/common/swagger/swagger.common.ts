import { ApiResponse } from '@nestjs/swagger';

export const buildHttpErrorSchema = (
  statusCode: number,
  messageExample: string,
  pathExample: string,
  errorExample: string | null = null,
) => ({
  type: 'object',
  properties: {
    statusCode: { type: 'integer', example: statusCode },
    message: { type: 'string', example: messageExample },
    path: { type: 'string', example: pathExample },
    timestamp: {
      type: 'string',
      format: 'date-time',
      example: '2025-01-01T12:00:00.000Z',
    },
    error: { type: 'string', nullable: true, example: errorExample },
  },
  required: ['statusCode', 'message', 'path', 'timestamp'],
});

export const ApiHttpError = (params: {
  status: number;
  description: string;
  messageExample: string;
  pathExample: string;
  errorExample?: string | null;
}) =>
  ApiResponse({
    status: params.status,
    description: params.description,
    schema: buildHttpErrorSchema(
      params.status,
      params.messageExample,
      params.pathExample,
      params.errorExample ?? null,
    ),
  });
