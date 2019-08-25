const errorHandler = (err, req, res, next) => {
  // We will define a custom Error Object to send to client
  // it will have 3 attributes:
  // error
  // message
  // httpStatusCode
  const errorType = err.constructor.name;
  let name = '';
  let message = '';
  let httpStatusCode;

  switch (errorType) {
    case 'MongooseError':
      if (err.errors) {
        for (let errName in err.errors) {
          //capture message for the first error and quit (it's enough)
          name = err.errors[errName].name;
          httpStatusCode = 400;
          message = err.errors[errName].message;
          break;
        }
      } else {
        name = err.name;
        httpStatusCode = 403;
        message = 'No valid request';
      }
      break;

    case 'MongoError':
      //All MongoError object has a code ???
      switch (err.code) {
        //codes 11000 and 11001 are about Unique Constraints
        case 11000:
        case 11001:
          name = 'UniqueError';
          httpStatusCode = 400;
          message = getUniqueErrorMessage(err);
      }

      break;

    case 'Error':
      message = err.message;
      if (err.httpStatusCode) {
        httpStatusCode = err.httpStatusCode;
        switch (httpStatusCode) {
          case 401:
          case 403:
            name = 'AuthorizationError';
            break;
          case 404:
            name = 'NotFoundError';
            break;
          default:
            name = 'DefaultError';
            break;
        }
      } else {
        httpStatusCode = 500;
        name = 'UnkownError';
      }
      break;
    case 'TokenExpiredError':
      name = err.name;
      httpStatusCode = 500;
      message = 'Session expired';
      break;
    case 'EvalError':


    case 'RangeError':

    case 'ReferenceError':

    case 'SyntaxError':

    case 'TypeError':

    case 'URIError':

    default:
  }

  // console.log('Mensajes error original:');
  // console.log('========================')
  // console.log('Tipo de error: ', err.constructor.name);
  // console.log('Codigo de error: ', err.code);
  // console.log('Nombre de error: ', err.name);
  // console.log('httpStatusCode: ', err.httpStatusCode);
  // console.log('Mensaje: ', err.message);

  const error = {
    error: name,
    httpStatusCode: httpStatusCode,
    message: message
  }

  // console.log('\nMensajes error al cliente:');
  // console.log('========================')
  // console.log('error: ', error.error);
  // console.log('httpStatusCode: ', error.httpStatusCode);
  // console.log('mensaje: ', error.message);

  return res.status(400).json(error);
}

const getUniqueErrorMessage = (err) => {
  let message = '';
  try {
    let fieldname = err.message.substring(err.message.lastIndexOf('.$') + 2, err.message.lastIndexOf('_1'));
    message = fieldname.charAt(0).toUpperCase() + fieldname.slice(1) + ' already exist';
  } catch (e) {
    message = 'Unique document already exist'
  }
  return message;
}

module.exports = errorHandler;
