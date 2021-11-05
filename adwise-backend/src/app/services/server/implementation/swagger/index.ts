import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerDoc: swaggerJsdoc.SwaggerDefinition = {
    swagger: '2.0',
    info: {
        title: 'AdWise API server',
        version: '1.0.0',
        description: 'AdWise API server is the main backend application for client applications i.e MA and CRM',
    },
    basePath: '/v1',
    schemes: ['http'],
    host: 'localhost:5000',
    paths: {
       '/accounts/users/me': {
           get: {
               summary: 'Get current user info',
               produces: ['application/json'],
               parameters: [],
               responses: {
                   200: {
                       description: 'Successfull operation',
                       schema: {
                           $ref: '#/definitions/successfulResponse'
                       }
                   },
                   403: {
                    description: 'Unsuccessful operation',
                    schema: {
                        $ref: '#/definitions/unsuccessfulResponse'
                    }
                }
               }
           }
       },
        '/accounts/users/create-user': {
            get: {
                summary: 'Create a new user',
                produces: ['application/json'],
                parameters: [{
                    in: 'body',
                    name: 'firstName'
                }],
                responses: {
                    200: {
                        description: 'Successfull operation',
                        schema: {
                            $ref: '#/definitions/successfulResponse'
                        }
                    }
                }
            }
        }
    },
    definitions: {
        successfulResponse: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        '*': {
                            type: 'object'
                        }
                    }
                }
            }
        },
        unsuccessfulResponse: {
            type: 'object',
            properties: {
                error: {
                    type: 'object',
                    properties: {
                        'message': {
                            type: 'string'
                        },
                        'code': {
                            type: 'string'
                        },
                        'HTTPStatus': {
                            type: 'number'
                        }
                    }
                }
            }
        }
    }
};