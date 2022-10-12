import Boom from '@hapi/boom';

export const getBearer = (auth) => {
  if (!auth) {
    throw 'Unauthorized';
  }

  if (auth.includes('Bearer')) {
    return auth.split('Bearer ')[1];
  } else {
    throw 'Unauthorized';
  }
};


export const checkError = (data = null) => {
  if (data.hasOwnProperty('error')) {
    throw data.error;
  }
}

export const handleError = (error) => {
  if (typeof error === 'string') {
    return new Boom.Boom(error, {
      statusCode: 401,
    });
  }

  if (error.code >= 400 && error.code < 500) {
    const err = new Error(error.message);
    return new Boom.boomify(err, {
      statusCode: error.code,
    });
  }

  return new Boom.Boom(error.message, {
    statusCode: error.code,
  });
}
