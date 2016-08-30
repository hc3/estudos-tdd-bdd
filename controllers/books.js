const defaultResponse = (data, statusCode = 200) => ({
  data,
  statusCode,
});

const errorResponse = (message, statusCode = 400) => defaultResponse({
  error: message,

}, statusCode);

class BooksController {

  constructor(Books) {
    this.Books = Books;
  }

  getAll() {
    return this.Books.findAll({})
      .then(result => defaultResponse(result))
      .catch(() => errorResponse(error.message));
  }

  getById(params) {
    return this.Books.findOne({ where: params })
      .then(result => defaultResponse(result))
      .catch(() => errorResponse(error.message));
  }

  create(data) {
          console.log("data:",data);
          return this.Books.create(data)
      .then(result => defaultResponse(result, 201))
      .catch(() => errorResponse(error.message, 422));
  }

  update(data, params) {
    return this.Books.update(data, { where: params })
      .then(result => defaultResponse(result))
      .catch(() => errorResponse(error.message, 422));
  }

  delete(params) {
    return this.Books.destroy({ where: params })
      .then(result => defaultResponse(result, 204))
      .catch(() => errorResponse(error.message, 422));
  }

}

export default BooksController;
