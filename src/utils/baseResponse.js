function base(code, payload) {
  return {
    code,
    ...payload,
    timestamp: new Date().toISOString()
  };
}

function ok(data = null) {
  return base(200, { data });
}

function created(data = null) {
  return base(201, { data });
}

function badRequest(errors = []) {
  if (!Array.isArray(errors)) errors = [errors];
  return base(400, { errors });
}

function unauthorized(errors = []) {
  if (!Array.isArray(errors)) errors = [errors];
  return base(401, { errors });
}

function forbidden(errors = []) {
  if (!Array.isArray(errors)) errors = [errors];
  return base(403, { errors });
}

function notFound(errors = []) {
  if (!Array.isArray(errors)) errors = [errors];
  return base(404, { errors });
}

function internalError(errors = []) {
  if (!Array.isArray(errors)) errors = [errors];
  return base(500, { errors });
}

module.exports = {
  ok,
  created,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  internalError
};
