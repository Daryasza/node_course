exports.checkBody = (body, fields = []) => {
  if(!Object.keys(body).length) {
    return {
      code: 400,
      message: { error: 'The body cannot be empty' }
    }
  }
  for (const field of fields) {
    if (!body[field]) {
      return {
        code: 400,
        message: { error: `The '${field}' field is required`}
      }
    }
  }
  return {};
};

exports.cutResponse = (objList, requiredFields, optionalFields = []) => {
  var formattedList = []

  objList.forEach(obj => {
    var formattedObj = {}
    requiredFields.forEach(field => formattedObj[field] = obj[field]);
    optionalFields.forEach(field => {
      if (obj[field])
        formattedObj[field] = obj[field];
    });
    formattedList.push(formattedObj)
  });
  return formattedList;
};
